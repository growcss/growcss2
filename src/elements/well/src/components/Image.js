//@flow
import React, { Component } from 'react';
import classNames from 'classnames';
import { Image as DefaultImage } from '@growcss/element-image';
import type { ImageType } from '../types';

export default class Image extends Component<ImageType> {
  render() {
    const { backgroundImages, previewImage, sizes } = this.props;
    const className = classNames('gc-well-image-curtain');

    return (
      <div>
        <div className={className} />
        <DefaultImage
          previewImage={previewImage}
          backgroundImages={backgroundImages}
          Sizes={sizes}
        />
      </div>
    );
  }
}
