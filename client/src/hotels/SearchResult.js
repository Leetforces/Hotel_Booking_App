import React, { useState, useEffect } from 'react'
import queryString from 'query-string'
import { Link } from 'react-router-dom'
import Search from '../components/forms/Search';
import { searchListings } from '../actions/hotel';
import SmallCard from '../components/cards/SmallCard'
const SearchResult = () => {
    //state
    const [searchLocation, setSearchLocation] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [searchBed, setSearchBed] = useState("");
    const [hotels, setHotels] = useState([]);

    //when component mounts, get search params from url and use to send search query to backend
    useEffect(() => {
        const { location, date, bed } = queryString.parse(window.location.search);
        console.table({ location, date, bed });
        SearchListings({ location, date, bed });
    }, [window.location.search]);

    const SearchListings = async ({ location, date, bed }) => {
        const res = await searchListings({ location, date, bed });
        console.log("searchListings=====>", res);
        if (res && res.data)
            setHotels(res.data);
    }

    return (
        <>
            <div className="col " >
                <br />
                <Search />
            </div>
            <div className="container-fluid marginTop">
                <div className="row">
                    {
                        hotels.map((h) => (
                            <>
                                <SmallCard key={h._id} h={h} />
                            </>
                        ))
                    }
                </div>

            </div>

        </>
    )
}

export default SearchResult
