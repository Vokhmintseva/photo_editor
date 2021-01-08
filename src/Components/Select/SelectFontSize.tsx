import React from 'react';
import './SelectFontFamily.css';

interface SelectFontSizeProps {
    label: string,
    value: number,
    onChange: (event: any) => void
}

const sizes: Array<number> = [];
for (let i=6; i < 100; i++) {
    sizes[i] = i;
}

const SelectFontSize = (props: SelectFontSizeProps) => {
    const htmlFor = `${props.label}-${Math.random()}`

    return (
        <div className="">
            <label htmlFor={htmlFor}>{props.label}</label>
            <select
                id={htmlFor}
                value={props.value}
                onChange={props.onChange}
            >
                {sizes.map((option: any, index: any) => {
                    return (
                        <option
                            value={option}
                            key={index}
                        >
                            {option}
                        </option>
                    )
                })}    
            </select>    
        </div>
    )
}

export default SelectFontSize;