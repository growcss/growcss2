import styled from 'styled-components';
import { GridElementAlign } from '../utils/flex-align';

interface XYGridElementProps {
  gridDirection?: string;
  flexWrap: boolean;
  gridHeight?: string;
  alignX?: string | null;
  alignY?: string | null;
}

export const XYGridElement = styled.div<XYGridElementProps>`
  display: flex;
  flex-flow: ${props => (props.gridDirection === 'horizontal' ? 'row' : 'column')}
    ${props => (props.flexWrap ? 'wrap' : 'nowrap')};

  -webkit-box-orient: ${props => props.gridDirection};
  -webkit-box-direction: normal;
  ${props => (props.gridHeight !== undefined ? `height:${props.gridHeight};` : '')}
  ${props => GridElementAlign(props.alignX || null, props.alignY || null)}
`;
