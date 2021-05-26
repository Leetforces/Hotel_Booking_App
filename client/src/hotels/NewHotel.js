import { useState } from "react";
import { toast } from "react-toastify";
import { DatePicker, Select } from "antd";
import AlgoliaPlaces from "algolia-places-react";
import moment from "moment";
import { createHotel } from "../actions/hotel";
import { useSelector } from "react-redux";
const { Option } = Select;
const config = {
  appId: process.env.REACT_APP_ALGOLIA_APP_ID,
  apiKey: process.env.REACT_APP_ALGOLIA_API_KEY,
  language: "en",
  countries: ["in"],
};
const NewHotel = () => {
  const { auth } = useSelector((state) => ({ ...state }));
  const { token } = auth;
  const [values, setValues] = useState({
    title: "",
    content: "",
    image: "",
    price: "",
    from: "",
    to: "",
    bed: "",
  });
  const [location, setLocation] = useState();
  const [preview, setPreview] = useState(
    "https://via.placeholder.com/100x100.png?text=PREVIEW"
  );

  const handleImageChange = (event) => {
    setPreview(URL.createObjectURL(event.target.files[0])); // convert into link to show
    setValues({ ...values, image: event.target.files[0] }); // set image as files
  };
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    let hotelData = new FormData();
    hotelData.append("title", title);
    hotelData.append("content", content);
    image && hotelData.append("image", image);
    hotelData.append("location", location);
    hotelData.append("price", price);
    hotelData.append("from", from);
    hotelData.append("to", to);
    hotelData.append("bed", bed);
    try {
      let res = await createHotel(token, hotelData);
      console.log("HOTEL CREATE RESPONSE===>", res);
      toast.success("New Hotel Created SuccessFully");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.log("Create Post Error", err);
      toast.error(err.response.data.err);
    }
  };

  //destructuring variable from state
  const { title, content, image, price, from, to, bed } = values;
  const hotelForm = () => (
    <>
      <form onSubmit={handleSubmit}>
        <div className="from-group">
          <label className="btn btn-outline-secondary btn-block m-2 text-left">
            Image
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              hidden
            />
          </label>

          <input
            type="text"
            name="title"
            onChange={handleChange}
            placeholder="Title"
            className="form-control m-2"
            value={title}
          />
          <textarea
            type="text"
            name="content"
            onChange={handleChange}
            placeholder="Content"
            className="form-control m-2"
            value={content}
          />

          <AlgoliaPlaces
            className="form-control ml-2 mr-2"
            placeholder="Location"
            defaultValue={location}
            options={config}
            onChange={({ suggestion }) => setLocation(suggestion.value)}
            style={{ height: "50px" }}
          />

          <input
            type="number"
            name="price"
            onChange={handleChange}
            placeholder="Price"
            className="form-control m-2"
            value={price}
          />

          <Select
            onChange={(value) => setValues({ ...values, bed: value })}
            className="w-100 m-2"
            size="large"
            placeholder="Number of Beds"
          >
            <Option key={1}>{1}</Option>
            <Option key={2}>{2}</Option>
            <Option key={3}>{3}</Option>
            <Option key={4}>{4}</Option>
          </Select>
        </div>
        <DatePicker
          placeholder="From Date"
          className="from-control m-2"
          onChange={(date, dateString) =>
            setValues({ ...values, from: dateString })
          }
          disabledDate={(current) =>
            current && current.valueOf() < moment().subtract(1, "days")
          }
        />
        <DatePicker
          placeholder="To Date"
          className="from-control m-2"
          onChange={(date, dateString) =>
            setValues({ ...values, to: dateString })
          }
          disabledDate={(current) =>
            current && current.valueOf() < moment().subtract(1, "days")
          }
        />
        <button className="btn btn-outline-primary m-2">Save</button>
      </form>
    </>
  );

  return (
    <>
      <div className="container-fluid bg-secondary p-5 text-center">
        <h2>Add Hotel</h2>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-10">
            <br />
            {hotelForm()}
          </div>
          <div className="col-md-2">
            <img
              src={preview}
              alt="preview_image"
              className="img img-fluid m-2"
            ></img>
            <pre>{JSON.stringify(values, null, 4)}</pre>
            {JSON.stringify(location)}
          </div>
        </div>
      </div>
    </>
  );
};

export default NewHotel;
