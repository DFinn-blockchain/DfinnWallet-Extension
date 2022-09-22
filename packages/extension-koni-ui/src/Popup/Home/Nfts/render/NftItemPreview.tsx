// Copyright 2019-2022 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import '@google/model-viewer';

import Spinner from '@subwallet/extension-koni-ui/components/Spinner';
import { _NftItem } from '@subwallet/extension-koni-ui/Popup/Home/Nfts/types';
import { Theme, ThemeProps } from '@subwallet/extension-koni-ui/types';
import React, { useCallback, useContext, useState } from 'react';
// @ts-ignore
import LazyLoad from 'react-lazyload';
import styled, { ThemeContext } from 'styled-components';

interface Props {
  className?: string;
  data: _NftItem;
  onClick: (data: any) => void;
  collectionImage?: string;
}

const SHOW_3D_MODELS = ['pioneer', 'bit.country'];

function NftItemPreview ({ className, collectionImage, data, onClick }: Props): React.ReactElement<Props> {
  const [loading, setLoading] = useState(true);
  const [showImage, setShowImage] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [show3dViewer, setShow3dViewer] = useState(false);

  const [imageError, setImageError] = useState(false);
  const themeContext = useContext(ThemeContext as React.Context<Theme>);

  const handleOnLoad = useCallback(() => {
    setLoading(false);
  }, []);

  const handleOnClick = useCallback(() => {
    onClick(data);
  }, [data, onClick]);

  const handleImageError = useCallback(() => {
    setLoading(false);
    setShowImage(false);
  }, []);

  const handleVideoError = useCallback(() => {
    setImageError(true);
  }, []);

  const getItemImage = useCallback(() => {
    if (data.image && !imageError) {
      return data.image;
    } else if (collectionImage) {
      return collectionImage;
    }

    return themeContext.logo;
  }, [collectionImage, data.image, imageError, themeContext.logo]);

  const getNftImage = useCallback(() => {
    if (showImage) {
      return (
        <LazyLoad
          scrollContainer={'.home-tab-contents'}
        >
          <img
            alt={'collection-thumbnail'}
            className={'collection-thumbnail'}
            onError={handleImageError}
            onLoad={handleOnLoad}
            src={getItemImage()}
            style={{ borderRadius: '5px 5px 0 0' }}
          />
        </LazyLoad>
      );
    }

    if (showVideo) {
      return (
        <LazyLoad
          scrollContainer={'.home-tab-contents'}
        >
          <video
            autoPlay
            height='124'
            loop={true}
            muted
            onError={handleVideoError}
            width='124'
          >
            <source
              src={getItemImage()}
              type='video/mp4'
            />
          </video>
        </LazyLoad>
      );
    }

    if (show3dViewer && data.chain && SHOW_3D_MODELS.includes(data.chain)) {
      return (
        // @ts-ignore
        <model-viewer
          alt={'model-viewer'}
          animation-name={'Idle'}
          ar-status={'not-presenting'}
          auto-rotate={true}
          auto-rotate-delay={100}
          bounds={'tight'}
          environment-image={'neutral'}
          interaction-prompt={'none'}
          loading={'lazy'}
          rotation-per-second={'15deg'}
          shadow-intensity={'1'}
          src={data.image}
          style={{ width: '100%', height: '402px', cursor: 'pointer', borderRadius: '5px' }}
        />
      );
    }

    return (
      <img
        alt={'default-img'}
        className={'collection-thumbnail'}
        src={themeContext.logo}
        style={{ borderRadius: '5px 5px 0 0' }}
      />
    );
  }, [data.chain, data.image, getItemImage, handleImageError, handleOnLoad, handleVideoError, showImage, themeContext.logo]);

  return (
    <div className={className}>
      <div
        className={'nft-preview'}
        onClick={handleOnClick}
        style={{ height: '164px' }}
      >
        <div className={'img-container'}>
          {
            loading &&
            <Spinner className={'img-spinner'} />
          }

          {getNftImage()}
        </div>

        <div className={'collection-title'}>
          <div
            className={'collection-name'}
            title={data.name ? data.name : `#${data?.id as string}`}
          >
            {data.name ? data.name : `#${data?.id as string}`}
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(styled(NftItemPreview)(({ theme }: ThemeProps) => `
  .img-container {
    position: relative;
  }

  .img-spinner {
    position: absolute;
  }

  .nft-preview {
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.2);
    width: 124px;
    &:hover {
      cursor: pointer;
    }

    .collection-thumbnail {
      display: block;
      height: 124px;
      width: 124px;
      object-fit: contain;
    }

    .collection-name {
      width: 70%
      text-transform: capitalize;
      font-size: 16px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .collection-title {
      height: 40px;
      padding-left: 10px;
      padding-right: 10px;
      display: flex;
      align-items: center;
      background-color: ${theme.popupBackground};
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.13);
      border-radius: 0 0 5px 5px;
    }

    .collection-item-count {
      font-size: 14px;
      margin-left: 5px;
      font-weight: normal;
      color: ${theme.iconNeutralColor};
    }
  }
`));
