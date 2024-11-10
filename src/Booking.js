import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, RadioGroup, FormControlLabel, Radio } from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { TextField } from '@mui/material';


const Booking = () => {


    const [step, setStep] = useState(0);
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');

    const [wheels, setWheels] = useState('');



    const [vehicleTypes, setVehicleTypes] = useState([]);

    //set and get data
    const [vehicleTypesData, setVehicleTypesData] = useState([]);
    const [dataWheels, setDataWheels] = useState([]);
    const [vehicleData, setVehicleData] = useState([]);
    //set and get data

    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicleType, setSelectedVehicleType] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [dates, setDates] = useState([null, null]);


    useEffect(() => {
        // Fetch vehicle types when the component mounts
        // axios.get('http://localhost:3001/api/vehicle-types')
        //   .then(response => setVehicleTypes(response.data))
        //   .catch(error => console.error(error));

        get_wheel_type();


    }, []);
    // 
    useEffect(() => {
        if (vehicleTypes.length > 0) {
            console.log("vehicleTypes ==>", vehicleTypes)
            try {
                axios.get(`http://localhost:3003/get-vehicle/${vehicleTypes}`)
                    .then(response => {
                        console.log(response.data.data)
                        setVehicleData(response.data.data)
                    });
            }
            catch (e) {
                console.log(e)
            }

        }
    }, [vehicleTypes]);


    const get_wheel_type = () => {
        axios.get('http://localhost:3003/get-types')
            .then((response) => {
                console.log("response", response)
                setDataWheels(response.data.data)
            })
            .catch(error => console.error(error));
    }
    const handleNext = () => {
        if (step === 0 && (!name || !lastName)) {
            alert('Please enter your full name');
            return;
        }
        if (step === 1 && !wheels) {
            alert('Please select the number of wheels');
            return;
        }
        if (step === 2 && !vehicleTypes) {
            alert('Please select a vehicle type');
            return;
        }
        if (step === 3 && !selectedVehicle) {
            alert('Please select a vehicle');
            return;
        }
        if (step === 4 && (!dates[0] || !dates[1])) {
            alert('Please select a valid date range');
            return;
        }
        setStep(step + 1);
    };

    const handleWheelsChange = (event) => {
        const selectedWheels = event.target.value;
        setWheels(selectedWheels);

        if (selectedWheels !== '') {
            axios.get(`http://localhost:3003/get-vehicle-type/${selectedWheels}`)
                .then(response => {
                    console.log(response.data.data)
                    setVehicleTypesData(response.data.data)
                });
        }
    };
const handleSubmit=()=>{
    let obj={
        first_name:name,
        last_name: lastName,
        vehicle_id:   selectedVehicle,
        startDate: dates[0],
        endDate:   dates[1],
        status:"Pending",
    }
    axios.post('http://localhost:3003/add-booking', { obj })
    .then(response => {
      console.log(response.data.data);
      if(response.data.status==1){
        alert('Book Request Sent Successfully')
      }
    //   setVehicleTypesData(response.data.data);
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
  


console.log("obj ==>",obj)
}

    return (
        <>
            <div className="flex h-screen">
                <div class="m-auto shadow-lg" style={{padding:'70px'}}>
                    <div>
                        <h5 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white" style={{fontSize:'35px',textAlign:'center'}}>Book Rental Vehicle</h5>
                    </div>
                    {step === 0 && (
                        <div>
                             <fieldset>
                             <legend class="text-sm/6 font-semibold text-gray-900">Customer Name</legend>
                            <TextField label="First Name" value={name} onChange={(e) => setName(e.target.value)} />
                            <TextField label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                </fieldset>
                        </div>
                    )}

                    {step === 1 && (
                         <fieldset>
                             <legend class="text-sm/6 font-semibold text-gray-900">Wheel Type</legend>
                        <RadioGroup value={wheels} onChange={handleWheelsChange}>
                            {dataWheels.length > 0 && dataWheels.map((item) => {
                                console.log("item ==>", item)
                                return (
                                    <FormControlLabel
                                        key={item.id} // Add key here
                                        value={item.id}
                                        control={<Radio />}
                                        label={item.name}
                                    />
                                )
                            }

                            )}

                            {/* <FormControlLabel value="4" control={<Radio />} label="4 Wheels" /> */}
                        </RadioGroup>
                        </fieldset>
                    )}

                    {step === 2 && (
                         <fieldset>
                             <legend class="text-sm/6 font-semibold text-gray-900">Vehicle Type</legend>
                        <RadioGroup value={vehicleTypes} onChange={(e) => setVehicleTypes(e.target.value)}>
                            {vehicleTypesData.map(type => {
                                console.log(type)
                                return (
                                    <FormControlLabel key={type.id} value={type.id} control={<Radio />} label={type.name} />
                                )
                            })}
                        </RadioGroup>
                        </fieldset>
                    )}

                    {step === 3 && (
                          <fieldset>
                             <legend class="text-sm/6 font-semibold text-gray-900">Vehicles</legend>

                        <RadioGroup value={selectedVehicle} onChange={(e) => setSelectedVehicle(e.target.value)}>
                            {vehicleData.map(vehicle => (
                                <FormControlLabel key={vehicle.id} value={vehicle.id} control={<Radio />} label={vehicle.name} />
                            ))}
                        </RadioGroup>
                        </fieldset>
                    )}

                    {step === 4 && (
                        <div>
                              <fieldset>
                              <legend class="text-sm/6 font-semibold text-gray-900">Start & End Date</legend>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker value={dates[0]} onChange={(date) => setDates([date, dates[1]])} />
                                <DatePicker value={dates[1]} onChange={(date) => setDates([dates[0], date])} />
                            </LocalizationProvider>
</fieldset>
                        </div>
                    )}
 <div className="mt-6 flex items-center justify-end gap-x-6">
  {/* <button type="button" className="text-sm/6 font-semibold text-gray-900">Cancel</button> */}
  {(step < 4) ? <button onClick={handleNext} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Next</button>
  :  <button onClick={handleSubmit} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Submit</button>}
</div>

                    {/* {(step === 4) ? <Button onClick={handleNext} className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>Next</Button> : <Button  className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800' onClick={handleNext}>Submit</Button>} */}
                </div>
            </div>
        </>
    )
}
export default React.memo(Booking)
