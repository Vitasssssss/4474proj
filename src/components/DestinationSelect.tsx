import React, { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";

interface CityData {
    city: string;
    country: string;
}

// 选项的类型：react-select 接收 { value: string; label: string; } 这样的格式
interface OptionType {
    value: string;
    label: string;
}

interface DestinationSelectProps {
    onSelectDestination: (formatted: string) => void;
}

function DestinationSelect({ onSelectDestination }: DestinationSelectProps) {
    const [options, setOptions] = useState<OptionType[]>([]);
    const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);

    // 1. 加载本地 city+country 数据，并转换成 react-select 的格式
    useEffect(() => {
        fetch("cities.json")
            .then((res) => res.json())
            .then((data: CityData[]) => {
                const ops = data.map((item) => ({
                    value: `${item.city}, ${item.country}`,
                    label: `${item.city}, ${item.country}`
                }));
                setOptions(ops);
            })
            .catch((err) => console.error("Error fetching city data:", err));
    }, []);

    // 2. 当用户在下拉中选择某个值时
    const handleChange = (option: SingleValue<OptionType>) => {
        if (option) {
            setSelectedOption(option);
            // 将 "City, Country" 回调给父组件
            onSelectDestination(option.value);
        } else {
            setSelectedOption(null);
            onSelectDestination("");
        }
    };

    return (
        <Select
            options={options}           // 下拉选项
            value={selectedOption}      // 当前选择
            onChange={handleChange}     // 用户选择回调
            placeholder="Select city..."
            isClearable={true}          // 可选：允许清空
        />
    );
}

export default DestinationSelect;
