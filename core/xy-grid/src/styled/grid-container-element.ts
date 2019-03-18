import styled from 'styled-components';
import { Gutters } from '../utils/gutters';
import { GuttersProps } from '../../types';

interface GridContainerElementProps {
  maxWidth?: string | number;
  gutterSizes: string | number | GuttersProps;
  type: string | undefined;
}

export const GridContainerElement = styled.div<GridContainerElementProps>`
  max-width: ${props => props.maxWidth};
  margin: 0 auto;
  position: relative;

  ${props => (props.type === 'full' ? 'overflow-x: hidden;' : '')}
  ${props => Gutters(props.gutterSizes, 'padding')};
`;
