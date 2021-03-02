import styled from 'styled-components';
import { Button } from '../../button';
import { sizeUnits } from '../../../../theme/size';
import { color } from '../../../../theme';

export const Container = styled.form``;

export const ErrorMessage = styled.p`
  position: absolute;
  color: ${color.error};
`;

export const SubmitButton = styled(Button).attrs(() => ({ type: 'submit', fixedWidth: true }))`
  margin-top: ${sizeUnits(2)};
`;
