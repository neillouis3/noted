import type {
    DOMConversionMap,
    DOMConversionOutput,
    DOMExportOutput,
    EditorConfig,
    LexicalNode,
    NodeKey,
    SerializedLexicalNode,
    Spread,
  } from 'lexical';
  
  import { DecoratorNode } from 'lexical';
  import React from 'react';
  
  export interface ImagePayload {
    altText: string;
    height?: number;
    key?: NodeKey;
    maxWidth?: number;
    src: string;
    width?: number;
  }
  
  export type SerializedImageNode = Spread<
    {
      altText: string;
      height?: number;
      maxWidth?: number;
      src: string;
      width?: number;
    },
    SerializedLexicalNode
  >;
  
  export class ImageNode extends DecoratorNode<React.ReactElement> {
    __src: string;
    __altText: string;
    __width: 'inherit' | number;
    __height: 'inherit' | number;
    __maxWidth: number;
  
    static getType(): string {
      return 'image';
    }
  
    static clone(node: ImageNode): ImageNode {
      return new ImageNode(
        node.__src,
        node.__altText,
        node.__maxWidth,
        node.__width,
        node.__height,
        node.__key
      );
    }
  
    static importJSON(serializedNode: SerializedImageNode): ImageNode {
      const { altText, height, width, maxWidth, src } = serializedNode;
      const node = $createImageNode({
        altText,
        height,
        maxWidth,
        src,
        width,
      });
      return node;
    }
  
    exportDOM(): DOMExportOutput {
      const element = document.createElement('img');
      element.setAttribute('src', this.__src);
      element.setAttribute('alt', this.__altText);
      element.setAttribute('width', this.__width.toString());
      element.setAttribute('height', this.__height.toString());
      return { element };
    }
  
    static importDOM(): DOMConversionMap | null {
      return {
        img: (node: Node) => ({
          conversion: convertImageElement,
          priority: 0,
        }),
      };
    }
  
    constructor(
      src: string,
      altText: string,
      maxWidth: number = 500,
      width?: 'inherit' | number,
      height?: 'inherit' | number,
      key?: NodeKey
    ) {
      super(key);
      this.__src = src;
      this.__altText = altText;
      this.__maxWidth = maxWidth;
      this.__width = width || 'inherit';
      this.__height = height || 'inherit';
    }
  
    exportJSON(): SerializedImageNode {
      return {
        altText: this.getAltText(),
        height: this.__height === 'inherit' ? 0 : this.__height,
        maxWidth: this.__maxWidth,
        src: this.getSrc(),
        type: 'image',
        version: 1,
        width: this.__width === 'inherit' ? 0 : this.__width,
      };
    }
  
    setWidthAndHeight(
      width: 'inherit' | number,
      height: 'inherit' | number
    ): void {
      const writable = this.getWritable();
      writable.__width = width;
      writable.__height = height;
    }
  
    // View
    createDOM(config: EditorConfig): HTMLElement {
      const span = document.createElement('span');
      const theme = config.theme;
      const className = theme.image;
      if (className !== undefined) {
        span.className = className;
      }
      return span;
    }
  
    updateDOM(): false {
      return false;
    }
  
    getSrc(): string {
      return this.__src;
    }
  
    getAltText(): string {
      return this.__altText;
    }
  
    decorate(): React.ReactElement {
      return (
        <img
          src={this.__src}
          alt={this.__altText}
          style={{
            height: this.__height === 'inherit' ? 'inherit' : this.__height,
            maxWidth: this.__maxWidth,
            width: this.__width === 'inherit' ? 'inherit' : this.__width,
          }}
        />
      );
    }
  }
  
  export function $createImageNode({
    altText,
    height,
    maxWidth = 500,
    src,
    width,
    key,
  }: ImagePayload): ImageNode {
    return new ImageNode(src, altText, maxWidth, width, height, key);
  }
  
  export function $isImageNode(
    node: LexicalNode | null | undefined
  ): node is ImageNode {
    return node instanceof ImageNode;
  }
  
  function convertImageElement(domNode: Node): null | DOMConversionOutput {
    if (domNode instanceof HTMLImageElement) {
      const { alt: altText, src } = domNode;
      const node = $createImageNode({ altText, src });
      return { node };
    }
    return null;
  }