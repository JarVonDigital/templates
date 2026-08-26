import { ElementRef, Component, computed, inject, input, output, signal, viewChild } from '@angular/core';
import { LucideArrowUpRight, LucideCheck, LucideCircle, LucideEraser, LucideImagePlus, LucidePencil, LucideRotateCcw, LucideType, LucideUpload, LucideX } from '@lucide/angular';
import { PhotoAttachment, PhotoStore } from '../photo-store/photo-store';
import { AttachmentDialogState } from '../attachment-dialog-state/attachment-dialog-state';

type Point = { x: number; y: number };
type Annotation =
  | { id: number; type: 'circle'; center: Point; radius: number }
  | { id: number; type: 'callout'; start: Point; end: Point; number: number; text: string }
  | { id: number; type: 'text'; origin: Point; width: number; height: number; text: string; fontSize: number };
type CalloutAnnotation = Extract<Annotation, { type: 'callout' }>;
type TextAnnotation = Extract<Annotation, { type: 'text' }>;

@Component({
  selector: 'app-photo-upload-dialog',
  imports: [LucideArrowUpRight, LucideCheck, LucideCircle, LucideEraser, LucideImagePlus, LucidePencil, LucideRotateCcw, LucideType, LucideUpload, LucideX],
  templateUrl: './photo-upload-dialog.html',
  styleUrl: './photo-upload-dialog.scss',
})
export class PhotoUploadDialog {
  private readonly photoStore = inject(PhotoStore);
  private readonly dialogState = inject(AttachmentDialogState);
  readonly open = input(false);
  readonly closed = output<void>();
  readonly saved = output<PhotoAttachment>();

  readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');
  readonly imageSource = signal<string | null>(null);
  readonly photoTitle = signal('Site photo');
  readonly photoNote = signal('');
  readonly brushColor = signal('#ff4d5f');
  readonly brushSize = signal(3);
  readonly textSize = signal(14);
  readonly annotationTool = signal<'pen' | 'circle' | 'callout' | 'text'>('pen');
  readonly selectedAnnotationId = signal<number | null>(null);
  readonly canvasCursor = signal('crosshair');
  readonly canUndo = computed(() => this.snapshots().length > 0);
  readonly selectedCallout = computed(() => this.annotations().find((annotation): annotation is CalloutAnnotation => annotation.id === this.selectedAnnotationId() && annotation.type === 'callout'));
  readonly selectedTextBox = computed(() => this.annotations().find((annotation): annotation is TextAnnotation => annotation.id === this.selectedAnnotationId() && annotation.type === 'text'));

  private readonly snapshots = signal<readonly string[]>([]);
  private baseImageSource = '';
  private isDrawing = false;
  private startPoint: { x: number; y: number } | null = null;
  private drawingSnapshot: ImageData | null = null;
  private nextCalloutNumber = 1;
  private readonly baseCanvas = document.createElement('canvas');
  private readonly annotations = signal<readonly Annotation[]>([]);
  private interaction: { kind: 'create' | 'move' | 'resize'; id?: number; start: Point; annotation?: Annotation } | null = null;
  private nextAnnotationId = 1;
  private hasCalloutMargin = false;

  openFilePicker(): void { this.fileInput()?.nativeElement.click(); }

  handleFileSelection(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const source = typeof reader.result === 'string' ? reader.result : null;
      if (!source) return;
      this.baseImageSource = source;
      this.imageSource.set(source);
      this.snapshots.set([]);
      this.nextCalloutNumber = 1;
      this.nextAnnotationId = 1;
      this.hasCalloutMargin = false;
      this.annotations.set([]);
      this.selectedAnnotationId.set(null);
      this.photoTitle.set(file.name.replace(/\.[^/.]+$/, '') || 'Site photo');
      this.photoNote.set('');
      this.drawImage(source);
    });
    reader.readAsDataURL(file);
    input.value = '';
  }

  startDrawing(event: PointerEvent): void {
    const context = this.getContext();
    const canvas = this.canvas()?.nativeElement;
    if (!context || !canvas) return;
    this.isDrawing = true;
    canvas.setPointerCapture(event.pointerId);
    let point = this.getCanvasPoint(event, canvas);
    if (this.annotationTool() === 'callout' && !this.hasCalloutMargin) {
      this.addCalloutMargin();
      point = this.getCanvasPoint(event, canvas);
    }
    context.beginPath();
    context.moveTo(point.x, point.y);
    context.strokeStyle = this.brushColor();
    context.lineWidth = this.brushSize();
    context.lineCap = 'round';
    context.lineJoin = 'round';
    this.startPoint = point;
    this.drawingSnapshot = context.getImageData(0, 0, canvas.width, canvas.height);
    if (this.annotationTool() === 'pen') {
      this.canvasCursor.set('crosshair');
      const baseContext = this.baseCanvas.getContext('2d');
      baseContext?.beginPath();
      baseContext?.moveTo(point.x, point.y);
      if (baseContext) {
        baseContext.strokeStyle = this.brushColor();
        baseContext.lineWidth = this.brushSize();
        baseContext.lineCap = 'round';
        baseContext.lineJoin = 'round';
      }
      return;
    }
    const target = this.findAnnotation(point);
    if (target) {
      this.selectedAnnotationId.set(target.id);
      if (target.type === 'text') this.textSize.set(target.fontSize);
      const kind = this.isResizeHandle(target, point) ? 'resize' : 'move';
      this.interaction = { kind, id: target.id, start: point, annotation: target };
      this.canvasCursor.set(kind === 'resize' ? this.resizeCursor(target) : 'grabbing');
    } else {
      this.selectedAnnotationId.set(null);
      this.interaction = { kind: 'create', start: point };
      this.canvasCursor.set('crosshair');
    }
  }

  draw(event: PointerEvent): void {
    if (!this.isDrawing) {
      this.updateCanvasCursor(event);
      return;
    }
    const context = this.getContext();
    const canvas = this.canvas()?.nativeElement;
    if (!context || !canvas) return;
    const point = this.getCanvasPoint(event, canvas);
    if (this.annotationTool() === 'pen') {
      context.lineTo(point.x, point.y);
      context.stroke();
      const baseContext = this.baseCanvas.getContext('2d');
      baseContext?.lineTo(point.x, point.y);
      baseContext?.stroke();
      return;
    }
    if (!this.interaction) return;
    this.updateAnnotationPreview(point);
  }

  stopDrawing(event: PointerEvent): void {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    const canvas = this.canvas()?.nativeElement;
    if (!canvas) return;
    if (this.annotationTool() !== 'pen') this.updateAnnotationPreview(this.getCanvasPoint(event, canvas));
    if (this.interaction?.kind === 'create') {
      this.nextAnnotationId += 1;
      if (this.annotationTool() === 'callout') this.nextCalloutNumber += 1;
    }
    this.interaction = null;
    this.startPoint = null;
    this.drawingSnapshot = null;
    this.snapshots.update((snapshots) => [...snapshots, canvas.toDataURL('image/png')]);
    this.updateCanvasCursor(event);
  }

  undo(): void {
    const snapshots = this.snapshots();
    if (snapshots.length === 0) return;
    const previousSnapshots = snapshots.slice(0, -1);
    this.snapshots.set(previousSnapshots);
    this.annotations.set([]);
    this.selectedAnnotationId.set(null);
    this.drawImage(previousSnapshots.at(-1) ?? this.baseImageSource);
  }

  resetDrawing(): void {
    if (!this.baseImageSource) return;
    this.snapshots.set([]);
    this.nextCalloutNumber = 1;
    this.nextAnnotationId = 1;
    this.hasCalloutMargin = false;
    this.annotations.set([]);
    this.selectedAnnotationId.set(null);
    this.drawImage(this.baseImageSource);
  }

  selectColor(color: string): void { this.brushColor.set(color); }

  selectTool(tool: 'pen' | 'circle' | 'callout' | 'text'): void { this.annotationTool.set(tool); }
  selectBrushSize(size: number): void { this.brushSize.set(size); }
  selectTextSize(size: number): void {
    this.textSize.set(size);
    const id = this.selectedAnnotationId();
    if (id === null) return;
    this.annotations.update((annotations) => annotations.map((annotation) => annotation.id === id && annotation.type === 'text' ? { ...annotation, fontSize: size } : annotation));
    this.renderAnnotations();
  }
  updateAnnotationText(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    const id = this.selectedAnnotationId();
    if (id === null) return;
    this.annotations.update((annotations) => annotations.map((annotation) => annotation.id === id && (annotation.type === 'callout' || annotation.type === 'text') ? { ...annotation, text } : annotation));
    this.renderAnnotations();
  }

  updateTitle(event: Event): void { this.photoTitle.set((event.target as HTMLInputElement).value); }
  updateNote(event: Event): void { this.photoNote.set((event.target as HTMLTextAreaElement).value); }

  savePhoto(): void {
    const canvas = this.canvas()?.nativeElement;
    if (!canvas || !this.imageSource()) return;
    this.selectedAnnotationId.set(null);
    this.renderAnnotations();
    const selectedVisitId = this.dialogState.selectedVisitId();
    const photo = this.photoStore.addPhoto(canvas.toDataURL('image/jpeg', 0.88), this.photoTitle(), this.photoNote(), selectedVisitId === 'all' ? 2 : selectedVisitId);
    this.saved.emit(photo);
    this.close();
  }

  close(): void {
    this.isDrawing = false;
    this.imageSource.set(null);
    this.snapshots.set([]);
    this.nextCalloutNumber = 1;
    this.nextAnnotationId = 1;
    this.hasCalloutMargin = false;
    this.annotations.set([]);
    this.selectedAnnotationId.set(null);
    this.canvasCursor.set('crosshair');
    this.closed.emit();
  }

  private drawImage(source: string): void {
    const canvas = this.canvas()?.nativeElement;
    if (!canvas) {
      setTimeout(() => this.drawImage(source));
      return;
    }

    const image = new Image();
    image.addEventListener('load', () => {
      const maxWidth = 1100;
      const maxHeight = 700;
      const scale = Math.min(maxWidth / image.naturalWidth, maxHeight / image.naturalHeight, 1);
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      this.baseCanvas.width = canvas.width;
      this.baseCanvas.height = canvas.height;
      this.baseCanvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height);
      this.renderAnnotations();
    });
    image.src = source;
  }

  private getContext(): CanvasRenderingContext2D | null { return this.canvas()?.nativeElement.getContext('2d') ?? null; }

  private getCanvasPoint(event: PointerEvent, canvas: HTMLCanvasElement): { x: number; y: number } {
    const bounds = canvas.getBoundingClientRect();
    return { x: (event.clientX - bounds.left) * (canvas.width / bounds.width), y: (event.clientY - bounds.top) * (canvas.height / bounds.height) };
  }

  private updateAnnotationPreview(point: Point): void {
    const interaction = this.interaction;
    if (!interaction) return;
    let annotation: Annotation;
    if (interaction.kind === 'create') {
      if (this.annotationTool() === 'circle') {
        annotation = { id: this.nextAnnotationId, type: 'circle', center: interaction.start, radius: Math.hypot(point.x - interaction.start.x, point.y - interaction.start.y) };
      } else if (this.annotationTool() === 'callout') {
        annotation = { id: this.nextAnnotationId, type: 'callout', start: interaction.start, end: point, number: this.nextCalloutNumber, text: '' };
      } else {
        annotation = { id: this.nextAnnotationId, type: 'text', origin: interaction.start, width: Math.max(90, point.x - interaction.start.x), height: Math.max(32, point.y - interaction.start.y), text: 'Add text', fontSize: this.textSize() };
      }
      this.selectedAnnotationId.set(annotation.id);
      this.annotations.set([...this.annotations().filter((item) => item.id !== annotation.id), annotation]);
      this.renderAnnotations();
      return;
    }
    if (!interaction.annotation || interaction.id === undefined) return;
    const delta = { x: point.x - interaction.start.x, y: point.y - interaction.start.y };
    annotation = this.resizeOrMove(interaction.annotation, interaction.kind, delta, point);
    this.annotations.update((items) => items.map((item) => item.id === annotation.id ? annotation : item));
    this.renderAnnotations();
  }

  private resizeOrMove(annotation: Annotation, kind: 'move' | 'resize', delta: Point, point: Point): Annotation {
    if (annotation.type === 'circle') return kind === 'move'
      ? { ...annotation, center: { x: annotation.center.x + delta.x, y: annotation.center.y + delta.y } }
      : { ...annotation, radius: Math.max(8, Math.hypot(point.x - annotation.center.x, point.y - annotation.center.y)) };
    if (annotation.type === 'text') return kind === 'move'
      ? { ...annotation, origin: { x: annotation.origin.x + delta.x, y: annotation.origin.y + delta.y } }
      : { ...annotation, width: Math.max(90, point.x - annotation.origin.x), height: Math.max(32, point.y - annotation.origin.y) };
    return kind === 'move'
      ? { ...annotation, start: { x: annotation.start.x + delta.x, y: annotation.start.y + delta.y }, end: { x: annotation.end.x + delta.x, y: annotation.end.y + delta.y } }
      : { ...annotation, end: point };
  }

  private findAnnotation(point: Point): Annotation | undefined {
    return [...this.annotations()].reverse().find((annotation) => {
      if (annotation.type === 'circle') return Math.hypot(point.x - annotation.center.x, point.y - annotation.center.y) <= annotation.radius + Math.max(14, this.brushSize() * 2);
      if (annotation.type === 'text') return point.x >= annotation.origin.x && point.x <= annotation.origin.x + annotation.width && point.y >= annotation.origin.y && point.y <= annotation.origin.y + annotation.height;
      return this.distanceToSegment(point, annotation.start, annotation.end) <= Math.max(14, this.brushSize() * 2) || this.isResizeHandle(annotation, point);
    });
  }

  updateCanvasCursor(event: PointerEvent): void {
    const canvas = this.canvas()?.nativeElement;
    if (!canvas || this.isDrawing) return;
    const target = this.findAnnotation(this.getCanvasPoint(event, canvas));
    if (!target) {
      this.canvasCursor.set('crosshair');
      return;
    }
    this.canvasCursor.set(this.isResizeHandle(target, this.getCanvasPoint(event, canvas)) ? this.resizeCursor(target) : 'grab');
  }

  setCanvasCursor(cursor: string): void { this.canvasCursor.set(cursor); }

  private isResizeHandle(annotation: Annotation, point: Point): boolean {
    const handle = this.getResizeHandle(annotation);
    return Math.hypot(point.x - handle.x, point.y - handle.y) <= 20;
  }

  private distanceToSegment(point: Point, start: Point, end: Point): number {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const lengthSquared = dx * dx + dy * dy;
    const t = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared));
    return Math.hypot(point.x - (start.x + t * dx), point.y - (start.y + t * dy));
  }

  private renderAnnotations(): void {
    const context = this.getContext();
    const canvas = this.canvas()?.nativeElement;
    if (!context || !canvas || !this.baseCanvas.width) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(this.baseCanvas, 0, 0);
    for (const annotation of this.annotations()) {
      if (annotation.type === 'circle') this.drawCircle(context, annotation.center, { x: annotation.center.x + annotation.radius, y: annotation.center.y });
      else if (annotation.type === 'callout') this.drawCallout(context, annotation.start, annotation.end, annotation.number, annotation.text);
      else this.drawTextBox(context, annotation);
      if (annotation.id === this.selectedAnnotationId()) this.drawResizeHandle(context, annotation);
    }
  }

  private addCalloutMargin(): void {
    const canvas = this.canvas()?.nativeElement;
    if (!canvas || !this.baseCanvas.width) return;
    const padding = 64;
    const expanded = document.createElement('canvas');
    expanded.width = this.baseCanvas.width + padding * 2;
    expanded.height = this.baseCanvas.height + padding * 2;
    const expandedContext = expanded.getContext('2d');
    if (!expandedContext) return;
    expandedContext.fillStyle = '#ffffff';
    expandedContext.fillRect(0, 0, expanded.width, expanded.height);
    expandedContext.drawImage(this.baseCanvas, padding, padding);
    this.baseCanvas.width = expanded.width;
    this.baseCanvas.height = expanded.height;
    this.baseCanvas.getContext('2d')?.drawImage(expanded, 0, 0);
    canvas.width = expanded.width;
    canvas.height = expanded.height;
    this.annotations.update((annotations) => annotations.map((annotation) => annotation.type === 'circle'
      ? { ...annotation, center: { x: annotation.center.x + padding, y: annotation.center.y + padding } }
      : annotation.type === 'callout'
        ? { ...annotation, start: { x: annotation.start.x + padding, y: annotation.start.y + padding }, end: { x: annotation.end.x + padding, y: annotation.end.y + padding } }
        : { ...annotation, origin: { x: annotation.origin.x + padding, y: annotation.origin.y + padding } }));
    this.hasCalloutMargin = true;
    this.renderAnnotations();
  }

  private drawResizeHandle(context: CanvasRenderingContext2D, annotation: Annotation): void {
    const handle = this.getResizeHandle(annotation);
    context.beginPath();
    context.arc(handle.x, handle.y, 8, 0, Math.PI * 2);
    context.fillStyle = '#ffffff';
    context.fill();
    context.lineWidth = 3;
    context.strokeStyle = this.brushColor();
    context.stroke();
  }

  private getResizeHandle(annotation: Annotation): Point {
    if (annotation.type === 'circle') return { x: annotation.center.x + annotation.radius, y: annotation.center.y };
    if (annotation.type === 'text') return { x: annotation.origin.x + annotation.width, y: annotation.origin.y + annotation.height };
    const angle = Math.atan2(annotation.end.y - annotation.start.y, annotation.end.x - annotation.start.x);
    const offset = 18;
    return { x: annotation.end.x - Math.sin(angle) * offset, y: annotation.end.y + Math.cos(angle) * offset };
  }

  private resizeCursor(annotation: Annotation): string {
    return annotation.type === 'callout' ? 'ew-resize' : 'nwse-resize';
  }

  private drawCircle(context: CanvasRenderingContext2D, start: { x: number; y: number }, end: { x: number; y: number }): void {
    const radius = Math.hypot(end.x - start.x, end.y - start.y);
    context.beginPath();
    context.arc(start.x, start.y, radius, 0, Math.PI * 2);
    context.strokeStyle = this.brushColor();
    context.lineWidth = this.brushSize();
    context.stroke();
  }

  private drawCallout(context: CanvasRenderingContext2D, start: Point, end: Point, number: number, text: string): void {
    const size = Math.max(16, this.brushSize() * 2.1);
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const headLength = Math.max(10, this.brushSize() * 2);
    context.strokeStyle = this.brushColor();
    context.fillStyle = this.brushColor();
    context.lineWidth = this.brushSize();
    context.lineCap = 'round';
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.lineTo(end.x - headLength * Math.cos(angle - Math.PI / 6), end.y - headLength * Math.sin(angle - Math.PI / 6));
    context.moveTo(end.x, end.y);
    context.lineTo(end.x - headLength * Math.cos(angle + Math.PI / 6), end.y - headLength * Math.sin(angle + Math.PI / 6));
    context.stroke();
    context.fillRect(start.x - size / 2, start.y - size / 2, size, size);
    context.fillStyle = '#ffffff';
    context.font = `700 ${Math.round(size * .58)}px sans-serif`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(String(number), start.x, start.y + 1);
    const label = text.trim();
    if (label) {
      context.font = '600 14px "Verb", Arial, sans-serif';
      const labelWidth = context.measureText(label).width;
      context.fillStyle = 'rgb(255 255 255 / 92%)';
      context.fillRect(start.x + size / 2 + 4, start.y - size / 2, labelWidth + 10, size);
      context.fillStyle = '#173246';
      context.textAlign = 'left';
      context.fillText(label, start.x + size / 2 + 9, start.y + 1);
    }
  }

  private drawTextBox(context: CanvasRenderingContext2D, annotation: TextAnnotation): void {
    context.fillStyle = 'rgb(255 255 255 / 92%)';
    context.strokeStyle = this.brushColor();
    context.lineWidth = Math.max(2, this.brushSize() / 2);
    context.fillRect(annotation.origin.x, annotation.origin.y, annotation.width, annotation.height);
    context.strokeRect(annotation.origin.x, annotation.origin.y, annotation.width, annotation.height);
    context.fillStyle = '#173246';
    context.font = `600 ${annotation.fontSize}px "Verb", Arial, sans-serif`;
    context.textAlign = 'left';
    context.textBaseline = 'middle';
    context.fillText(annotation.text || 'Add text', annotation.origin.x + 9, annotation.origin.y + annotation.height / 2);
  }
}
