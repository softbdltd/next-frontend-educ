import Konva from 'konva';
import {Filter} from 'konva/lib/Node';
import {EditorPanel} from './interfaces/Editor';
import {ShapeType} from './interfaces/Shape';

export const CANVAS_STROKE = 1;
export const EDITOR_MARGIN = 8 + CANVAS_STROKE;

export const IMAGE_FILTERS: {[filter: string]: Filter} = {
  blur: Konva.Filters.Blur,
};

export const SHAPE_PROPERTIES_PANEL: Partial<{
  [key in ShapeType]: EditorPanel;
}> = {
  [ShapeType.Image]: EditorPanel.ImageProperties,
  [ShapeType.QrImage]: EditorPanel.ImageProperties,
  [ShapeType.Text]: EditorPanel.TextProperties,
  [ShapeType.Rectangle]: EditorPanel.RectangleProperties,
  [ShapeType.Line]: EditorPanel.LineProperties,
  [ShapeType.Input]: EditorPanel.InputProperties,
};

export const SHAPE_TOOL_PANEL: Partial<{[key in ShapeType]: EditorPanel}> = {
  [ShapeType.Image]: EditorPanel.Image,
  [ShapeType.Text]: EditorPanel.Text,
  [ShapeType.Rectangle]: EditorPanel.Elements,
  [ShapeType.Line]: EditorPanel.Elements,
  [ShapeType.Input]: EditorPanel.Input,
};

export enum DefaultFonts {
  Headline = 'Archivo Black',
  Regular = 'Arial',
  Cursive = 'cursive',
}

export enum Directions {
  Horizontal = 'H',
  Vertical = 'V',
}
