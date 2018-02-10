//@flow
import React, { Component } from 'react';
import { Gutters as DefaultGutters } from './Gutters';
import { CellElement } from '../styled/CellElement';
import type { CellType } from '../types';

export default class Cell extends Component<CellType> {
  static defaultProps = {
    gridColumns: 12,
    gutterSizes: DefaultGutters,
    vertical: false,
  };

  render() {
    const {
      children,
      gridColumns,
      cellType,
      gutterType,
      gutterSizes,
      vertical,
      small,
      smallOffset,
      medium,
      mediumOffset,
      large,
      largeOffset,
      xlarge,
      xlargeOffset,
      xxlarge,
      xxlargeOffset,
      align,
      ...other
    } = this.props;

    return (
      <CellElement
        gridColumns={gridColumns}
        cellType={cellType}
        gutterType={gutterType}
        gutterSizes={gutterSizes}
        vertical={vertical}
        small={small}
        smallOffset={smallOffset}
        medium={medium}
        mediumOffset={mediumOffset}
        large={large}
        largeOffset={largeOffset}
        xlarge={xlarge}
        xlargeOffset={xlargeOffset}
        xxlarge={xxlarge}
        xxlargeOffset={xxlargeOffset}
        align={align}
        {...other}
      >
        {children}
      </CellElement>
    );
  }
}
