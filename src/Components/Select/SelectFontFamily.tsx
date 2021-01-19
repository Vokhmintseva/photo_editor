import React from 'react';
import './SelectFontFamily.css';

interface SelectFontFamilyProps {
    label: string,
    value: string,
    onChange: (event: any) => void,
    options: Array<string>;
}

const SelectFontFamily = (props: SelectFontFamilyProps) => {
    const htmlFor = `${props.label}-${Math.random()}`

    return (
        <div className="">
            <label htmlFor={htmlFor} className="textbar__fontLabel">{props.label}</label>
            <select
                id={htmlFor}
                value={props.value}
                onChange={props.onChange}
                className="textbar__fontSelect"
            >
                {props.options.map((option: any, index: any) => {
                    return (
                        <option
                            value={option}
                            key={index}
                            style={{
                                fontFamily: `${option}`
                            }}
                        >
                            {option}
                        </option>
                    )
                })}    
            </select>    
        </div>
    )
}

export default SelectFontFamily;