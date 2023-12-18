import { FunctionComponent, PropsWithChildren } from 'react';

import styled from '@emotion/styled';

const ImgStyled = styled.img`
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
  object-position: center;
`;

interface PictureStyledProps extends PropsWithChildren {
  width?: number;
  height?: number;
}

const PictureStyled = styled.picture<PictureStyledProps>`
  display: block;
  width: ${(props) => (props.width ? `${props.width}px` : '25px')};
  height: ${(props) => (props.height ? `${props.height}px` : '25px')};
  position: relative;
  border-radius: inherit;
`;

interface PictureProps extends PropsWithChildren, PictureStyledProps {
  alt: string;
  src: string;
}

const Picture: FunctionComponent<PictureProps> = ({
  alt,
  src,
  width,
  height,
  ...props
}) => {
  return (
    <PictureStyled width={width} height={height}>
      <ImgStyled
        src={src}
        alt={alt}
        loading='lazy'
        decoding='async'
        {...props}
      />
    </PictureStyled>
  );
};

export default Picture;
