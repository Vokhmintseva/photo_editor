import React from 'react';
import './Select.css';

interface SelectProps {
    label: string,
    value: string,
    onChange: (event: any) => void,
    options: Array<Object>;
}

const Select = (props: SelectProps) => {
    const htmlFor = `${props.label}-${Math.random()}`

    return (
        <div className="">
            <label htmlFor={htmlFor}>{props.label}</label>
            <select
                id={htmlFor}
                value={props.value}
                onChange={props.onChange}
            >
                {props.options.map((option: any, index: any) => {
                    return (
                        <option
                            value={option.value}
                            key={option.value + index}
                        >
                            {option.text}
                        </option>
                    )
                })}    
            </select>    
        </div>
    )
}

export default Select;