interface OverUnderInputProps {
    label: string;
    value: number | undefined;
    onChange: (value: number) => void;
  }
  
  export const OverUnderInput: React.FC<OverUnderInputProps> = ({ label, value, onChange }) => {
    return (
      <label htmlFor="" className="flex gap-x-2 justify-end">
        <h1>{label}</h1>
        <input
          className="text-black"
          type="number"
          step={0.5}
          value={value || 0}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </label>
    );
  };
  