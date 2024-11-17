import { ChangeEvent } from "react";

interface InputProps {
  id: string;
  label: string;
  placeHolder: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function Input({ id, label, placeHolder, value, onChange }: InputProps) {
  return (
    <div className="flex flex-col gap-1 items-start">
      <label className="text-xl hover:cursor-pointer" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeHolder}
        className="outline-none bg-zinc-900  p-3 text-lg text-slate-200 rounded-lg w-full focus:ring-2 focus:ring-sky-600"
      />
    </div>
  );
}

export default Input;
