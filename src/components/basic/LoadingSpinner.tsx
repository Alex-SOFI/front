import { FunctionComponent, PropsWithChildren } from 'react';

import styled from '@emotion/styled';

import { theme } from 'styles/theme';

const SpinnerWrapperStyled = styled.span`
  position: ${(props: LoadingSpinnerProps) => props.position || 'absolute'};
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props: LoadingSpinnerProps) =>
    props.position === 'relative' ? '' : '100%'};
  height: 100%;
`;

const SpinnerStyled = styled.svg`
  .path {
    transform-origin: center;
    animation: rotate 1s linear infinite;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

interface LoadingSpinnerProps extends PropsWithChildren {
  size?: string;
  palette?: string;
  position?: string;
}

const LoadingSpinner: FunctionComponent<LoadingSpinnerProps> = ({
  size,
  palette,
  position,
  ...props
}) => (
  <SpinnerWrapperStyled position={position} {...props}>
    <SpinnerStyled viewBox='0 0 32 32' width={size || '50'}>
      <g fill={palette || theme.colors.grayDark}>
        <path
          d='M16,32A16,16,0,1,1,32,16,16.019,16.019,0,0,1,16,32ZM16,4A12,12,0,1,0,28,16,12.013,12.013,0,0,0,16,4Z'
          fill={palette || theme.colors.grayDark}
          opacity='0.4'
        />
        <path
          d='M32,16H28A12.013,12.013,0,0,0,16,4V0A16.019,16.019,0,0,1,32,16Z'
          className='path'
        />
      </g>
    </SpinnerStyled>
  </SpinnerWrapperStyled>
);

export default LoadingSpinner;
