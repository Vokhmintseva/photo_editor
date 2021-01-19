import React from 'react';
import './SelectFilter.css';

interface SelectProps {
    label: string,
    value: string,
    onChange: (event: any) => void,
    options: Array<Object>;
}

const SelectFilter = (props: SelectProps) => {
    const htmlFor = `${props.label}-${Math.random()}`

    return (
        <div className="filterBtn__selectWrapper" >
            <select
                id={htmlFor}
                value={props.value}
                onChange={props.onChange}
                className="filterBtn__select"
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

export default SelectFilter;