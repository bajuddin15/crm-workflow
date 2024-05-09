import React from "react";
import Select from "react-select";

interface SearchableSelectProps {
  options: any[];
  value: any | null; // Selected value
  onChange: (selectedOption: any | null) => void;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
}) => {
  return (
    <Select
      options={options}
      value={value} // Set the selected value
      onChange={onChange}
      isSearchable
      placeholder="Nothing Selected"
      className="w-full"
      styles={{
        control: (provided) => ({
          ...provided,
          borderColor: "#CBD5E0", // Customize border color
        }),
      }}
    />
  );
};

export default SearchableSelect;
