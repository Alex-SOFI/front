import { FunctionComponent } from 'react';

import styled from '@emotion/styled';

const ImgStyled = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
`;

interface PictureStyledProps {
  width?: number;
  height?: number;
  marginRight?: string;
}

const PictureStyled = styled.picture<PictureStyledProps>`
  display: block;
  width: ${(props) => (props.width ? `${props.width}px` : '25px')};
  height: ${(props) => (props.height ? `${props.height}px` : '25px')};
  position: relative;
  border-radius: inherit;
  ${(props) => props.marginRight && `margin-right: ${props.marginRight}`}
`;

interface PictureProps extends PictureStyledProps {
  alt: string;
  src: string;
}

const Picture: FunctionComponent<PictureProps> = ({
  alt,
  src,
  width,
  height,
  marginRight,
  ...props
}) => {
  return (
    <PictureStyled width={width} height={height} marginRight={marginRight}>
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
