import React, { useState, useEffect } from 'react';

//create your first component
const AppX = () => {
    //const emptyTodo = ["No tasks, add a task"]
	const [inputValue, setInputValue] = useState("");
	//const [todoArray, setTodoArray] = useState([]); // changed to an empty Array due to API req. 
    const [todoArray, setTodoArray] = useState([ {label:"sample task", done: false}, {label:"sample task2", done: false} ]); // for TESTING purposes - same format as new Array in API 
    const [serverUrl, setServerUrl] = useState("https://assets.breatheco.de/apis/fake/todos/user/swedishchef25"); // Need to put URL in useState to be able to pass it to useEffect

    // A set of code that will only execute after the first render 
    /// (Need to use a second arguement (Dependencies) to get the behaviour) -> useEffect(setup-functon, dependencies?)
    useEffect( () => {
        console.log("Running useEffect");
        console.log("Empty todo array?", todoArray);
        console.log("serverUrl in useEffect", serverUrl);

        // Call the function(s) to exectute onlt after the first render 
        fetchData(serverUrl)
        .catch(console.error);

        // Declaring the async functions to be used in the useEffect scope

        // fetchData - try to get data from API or create new user
        async function fetchData(serverUrl){
            console.log("serverUrl", serverUrl)

            // get the data from the API
            const resp = await getData(serverUrl)
            console.log(resp)
            if (!resp.ok){
                console.log("Could not fetch")
                await createUser(serverUrl);
                // HERE WE COULD ADD THE getData function again
            }
            else {
                const jsonData = await resp.json();
                console.log(jsonData)
                setTodoArray(jsonData)
            }
        }

        async function getData(serverUrl){
            console.log("Trying to fetch todo list data")
            try{
                const resp = await fetch(serverUrl, {
                    method: "GET",
                    //body: JSON.stringify(), // no body becasue we are not sending any data
                    headers: {
                        "Content-type": "application/json"
                    }
                })
                // Checking the response and that it executes after the fetch
                console.log("reps",resp)
                console.log("typeof(resp)",typeof(resp))
                console.log("resp.body", resp.body)
                console.log("resp.ok: ", resp.ok);
                console.log("resp.status: ",resp.status);
                //console.log("resp.text(): ",resp.text()); //  A readable stream can have at most one active reader at a time, and is locked to that reader until it is released
                return resp
            } catch (error) {
                console.log("Error creating User")
                console.error("Error:", error);
            }             
        }

        async function createUser(serverUrl){
                
            console.log("Creating new User")
            console.log("serverUrl", serverUrl)
            const data = [] // needs to be an emptry array according to API documentation 

            try{
                const response = await fetch(serverUrl, {
                    method: "POST",
                    body: JSON.stringify(data), // convert data to a string to send it over HTTP
                    headers: { 
                        "Content-Type": "application/json"
                        }
                    });
                //const resultPure = await response; // Gets the entire Response object 
                //console.log(resultPure) 
                const result = await response.json(); // Gets only the Response result:  {result: 'ok'}
                console.log("Success:", result);
                console.log("Data sent", JSON.stringify(data)) // Text (needs to be sent as text and then when we Get the data it needs to be converted back to Javascript format using .json() method )
                console.log("Same Data without JSON.stringify() method", data) // Array 
            } catch (error) {
                console.log("Error creating User")
                console.error("Error:", error);
            }                
        }

    }, []); // ADDING AN EMPTY ARRAY [] AS A SECOND ARGUMENT TO MAKE useEffect RUN ONLY AFTER FIRST RENDER -> THIS IS A DEPENDENCY ARRAY: useEffect(setup, dependencies?)

    // Declaring the functions related to on page events

    async function updateTodoDb(data, serverUrl){        
        console.log("RUNNING updateTodoDb")
        try{
            const response = await fetch(serverUrl, {
                method: "PUT",
                //body: data,
                body: JSON.stringify(data), // convert data to a string to send it over HTTP
                headers: { 
                    "Content-Type": "application/json"
                    }
                });
                console.log("JSON.stringify data", JSON.stringify(data) );
                const result = await response.json(); // Gets only the Response result:  {result: 'ok'}
                console.log("Success:", result);
                console.log("Data sent", JSON.stringify(data)) // Text (needs to be sent as text and then when we Get the data it needs to be converted back to Javascript format using .json() method )
        } catch (error) {
            console.log("Error")
            console.error("Error:", error);
        }                
    }

    const handleKeyDownApi = (event, serverUrl) => {
        console.log(event.key);
        if (event.key === "Enter"){
            console.log("todoArray", todoArray);
            
            // Reformating the input value to the format needed for the API
            const formatedInputValue = {label: inputValue, done:false}
            console.log(formatedInputValue)

            // Handling the 1st task being added 
            if (todoArray[0].label === "sample task"){
                setTodoArray( [formatedInputValue] );
                console.log("updatedTodo value: ",  [formatedInputValue] );
                updateTodoDb( [formatedInputValue] , serverUrl);
            }else{
                console.log("todoArray", todoArray)
                const updatedTodo = todoArray.concat(formatedInputValue);
                console.log("updatedTodo", updatedTodo)
                setTodoArray(updatedTodo)
                console.log("todoArray", todoArray)
                updateTodoDb(updatedTodo, serverUrl);
            }

            // Resetting the input field to be empty
            setInputValue("");
        };
    };

    const removeItem = (index, serverUrl) => {
        console.log(todoArray, index);
		//todoArray.splice(index, 1) does not work to manipulate the state
		// need to use Filter - to filer out index values clicked "X" from the return value 
		const filteredTodo = todoArray.filter((_, i) => i !== index);
        console.log("filteredTodo", filteredTodo);
        if (filteredTodo.length === 0){
            setTodoArray( [ {label:"sample task", done: false} ] )
            updateTodoDb([ {label:"sample task", done: false} ] , serverUrl);
        } else {
            setTodoArray(filteredTodo);
            updateTodoDb(filteredTodo, serverUrl);
        }
    }

    const removeAllItems = (serverUrl) => {
        console.log("Clicked Remove all todos");
        console.log(todoArray);
        setTodoArray( [ {label:"sample task", done: false} ] ); // Resets the todoArray to an "empty" Array with only the "No tasks, add a task" item
        updateTodoDb( [ {label:"sample task", done: false} ], serverUrl);
    };

    return (
		<div>
			<h1 className="text-center">todos</h1>
			<div className="d-flex justify-content-center">
				<ul className="list-group w-50">
					<input className="list-style" type="text" onChange={e => setInputValue(e.target.value)} value={inputValue} onKeyDown={(e) => handleKeyDownApi(e, serverUrl)} placeholder="What needs to be done?"/>
                    {todoArray.map( (item, index) => {
                        console.log(item, index);
                        console.log(item.label, index);
                        if (item.label === "sample task"){
                            return <li className="list-group-item list-style d-inline-flex justify-content-between" key={index}>{item.label}</li>
                        }else{
                            return <li className="list-group-item list-style d-inline-flex justify-content-between" key={index}>{item.label}

                                        <button>✅{"done:status"}</button>
                                        <button onClick={() => removeItem(index, serverUrl)}>x</button> 
                            
                                    </li>
                        }
                    })
                    }
					<li className="list-group-item list-style task-counter">{todoArray.length} items left</li>
					<li className="list-group-item list-style" id="button-li"><button id="remove-all-btn" onClick={() => removeAllItems(serverUrl)}>Remove all todos</button></li>
				</ul>
			</div>
		</div>
	)


}

export { AppX }