import styled from 'styled-components';

interface AnimationElementProps {
  size: number;
}

export const AnimationElement = styled.div<AnimationElementProps>`
  position: relative;
  height: ${props => props.size}px;
  width: ${props => props.size}px;
  box-sizing: border-box;
`;
