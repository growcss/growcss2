//@flow
import * as React from 'react';
import classNames from 'classnames';
import { Gutters as DefaultGutters } from './Gutters';
import { XYGridElement } from '../styled/XYGridElement';
import type { CellType, GridType, GuttersSizesType } from '../types';

export default class AbstractGrid extends React.Component<GridType> {
  static defaultProps = {
    gutterSizes: DefaultGutters,
    alignX: 'left',
  };

  /**
   * Setting for getting a gridy or gridx type.
   *
   * @param {boolean} vertical
   */
  isVertical: boolean;

  /**
   *
   * @param {any}                                children
   * @param {'padding' | 'margin'}               gutterType
   * @param {string | number | GuttersSizesType} gutterSizes
   *
   * @return {Object}
   */
  renderCellChildren(
    children: any,
    gutterType?: 'padding' | 'margin',
    gutterSizes?: string | number | GuttersSizesType,
  ) {
    return React.Children.map(children, thisArg => {
      return React.cloneElement(thisArg, {
        vertical: this.isVertical,
        gutterType,
        gutterSizes,
      });
    });
  }

  /**
   * @inheritdoc
   */
  render() {
    const { children, gutterSizes, gutterType, alignX, alignY, height, ...other } = this.props;
    const className = classNames(`gc-grid-${this.isVertical === true ? 'y' : 'x'}`);
    const direction = this.isVertical === true ? 'vertical' : 'horizontal';

    if (this.isVertical === true && height === undefined) {
      throw new Error('height value is missing on GridY.');
    }

    return (
      <XYGridElement
        className={className}
        gridDirection={direction}
        gutterSizes={gutterSizes}
        alignX={alignX}
        alignY={alignY}
        gridHeight={height}
        wrap
        {...other}
      >
        {this.renderCellChildren(children, gutterType, gutterSizes)}
      </XYGridElement>
    );
  }
}