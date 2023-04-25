import React, { forwardRef, useEffect, useRef } from 'react';

type TextInputProps = JSX.IntrinsicElements['input'] & {
    isFocused?: boolean;
    handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default forwardRef(function TextInput(
    { type = 'text', name, value, className, autoComplete, required, isFocused, handleChange = () => { } }: TextInputProps,
    ref
) {
    const input: any = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <div className="flex flex-col items-start">
            <input
                type={type}
                name={name}
                value={value}
                className={
                    `border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ` +
                    className
                }
                ref={input}
                autoComplete={autoComplete}
                required={required}
                onChange={(e) => handleChange(e)}
            />
        </div>
    );
});
