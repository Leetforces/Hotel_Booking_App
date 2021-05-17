import React, { useState } from 'react'
import { DatePicker, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons'
import AlgoliaPlaces from 'algolia-places-react'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
//destructure values from antd components
const { RangePicker } = DatePicker;
const { Option } = Select;
const config = {
    appId: process.env.REACT_APP_ALGOLIA_APP_ID,
    apiKey: process.env.REACT_APP_ALGOLIA_API_KEY,
    language: "en",
    countries: ["in"],
}
const Search = () => {
    const history = useHistory();

    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [bed, setBed] = useState("");

    const handleSubmit = () => {
        history.push(`/search-result?location=${location}&date=${date}&bed=${bed}`);
    }
    return (
        <div className="container " >
            <div className="row justify-content-between">
                <div className="col-sm-4">
                    <AlgoliaPlaces
                        className="removeMargin"
                        placeholder="location"
                        defaultValue={location}
                        options={config}
                        onChange={({ suggestion }) => setLocation(suggestion.value)}
                        style={{ height: "50px" }}
                    />
                </div>
                <div className="col-sm-4" >

                    <RangePicker onChange={(value, dateString) => setDate(dateString)} disabledDate={
                        (current) => current && current.valueOf() < moment().subtract(1, "days")

                    } style={{ height: "50px" }}/>
                </div>
                <div className="col-sm" >

                    <Select
                        onChange={(value) => setBed(value)}
                        size="large"
                        placeholder="Number of beds"
                    >
                        <Option key={1}>{1}</Option>
                        <Option key={2}>{2}</Option>
                        <Option key={3}>{3}</Option>
                        <Option key={4}>{4}</Option>
                    </Select>
                </div>
                <div className="col-sm" >
                    <SearchOutlined onClick={handleSubmit} className="btn btn-primary p-3 btn-square" />
                </div>

            </div>
        </div>
    )
}

export default Search
