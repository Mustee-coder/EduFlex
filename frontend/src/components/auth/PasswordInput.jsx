import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = ({
  name,
  value,
  onChange,
  placeholder,
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        name={name}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 pr-14 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
  type="button"
  onClick={() => setShow(!show)}
  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition"
>
  {show ? <EyeOff size={20} /> : <Eye size={20} />}
</button> 
    </div>
  );
};

export default PasswordInput;