import { ChangeEvent } from "react";

interface InputProps {
  id: string;
  label: string;
  placeHolder?: string;
  value: string;
  type?: "text" | "password";
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
}

function Input({
  id,
  label,
  placeHolder,
  value,
  type = "text",
  onChange,
  disabled = false,
  required = false,
}: InputProps) {
  return (
    <div className="flex-grow flex flex-col gap-1 items-start">
      <label className="text-lg font-medium hover:cursor-pointer" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        value={value}
        type={type}
        required={required}
        onChange={onChange}
        placeholder={placeHolder}
        className="outline-none bg-zinc-900  p-3 text-lg text-slate-200 rounded-lg w-full focus:ring-2 focus:ring-purple-500"
        disabled={disabled}
      />
    </div>
  );
}

export default Input;
