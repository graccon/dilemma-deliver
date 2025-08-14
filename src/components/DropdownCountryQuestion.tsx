import styled from "styled-components";
import colors from "../styles/colors";
import { textStyles } from "../styles/textStyles";
import { getNames } from "country-list";

interface DropdownCountryQuestionProps {
  index: number;
  question: string;
  value: string;
  onChange: (value: string) => void;
}

const countryList = [...getNames(), "Other"];

export default function DropdownCountryQuestion({
  index,
  question,
  value,
  onChange,
}: DropdownCountryQuestionProps) {
  const selectId = `country-select-${index}`;

  return (
    <Wrapper>
      <Label htmlFor={selectId}>
        {index}. {question}
      </Label>
      <Select id={selectId} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="" disabled hidden>
          Select a country
        </option>
        {countryList.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </Select>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
`;

const Label = styled.label`
  ${textStyles.h4()};
  color: ${colors.gray800};
`;

const Select = styled.select`
  ${textStyles.body()};
  padding: 10px 12px;
  border: 1px solid ${colors.gray400};
  border-radius: 8px;
  max-width: 300px;
  background-color: ${colors.white};
  color: ${colors.gray800};
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 2px ${colors.primary}33;
  }
`;