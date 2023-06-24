import React, { useState, useEffect } from 'react';

//include images into your bundle
//import rigoImage from "../../img/rigo-baby.jpg";

//create your first component
const App = () => {
    //const emptyTodo = ["No tasks, add a task"]
    const emptyTodo = [ {label:"No tasks, add a task", done:false} ]
	const [inputValue, setInputValue] = useState(null);
	const [todoArray, setTodoArray] = useState(emptyTodo);
    //console.log(todoArray);
    const [serverUrl, setServerUrl] = useState("https://assets.breatheco.de/apis/fake/todos/user/swedishchef25"); // Need to put URL in useState to be able to pass it to useEffect

    // A set of code that will only execute afte the first render 
    /// (Need to use a second arguement (Dependencies) to get the behaviour) -> useEffect(setup-functon, dependencies?)
    useEffect( () => {
        console.log("Running useEffect")
        console.log("Empty todo array?", todoArray)
        console.log("serverUrl in useEffect", serverUrl)

        // Call the function(s)
        fetchData(serverUrl)
        .catch(console.error);

        // declare the async functions
        async function fetchData(serverUrl){
            console.log("serverUrl", serverUrl)
            

            // get the data from the API
            console.log("Trying to fetch todo list data")
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
            
            if (!resp.ok){
                console.log("Could not fetch")
                await createUser(serverUrl);
            }
            else {
                const jsonData = await resp.json();
                console.log(jsonData)
                setTodoArray(jsonData)
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
        }
    }, []);  // ADDING AN EMPTY ARRAY [] AS A SECOND ARGUMENT TO MAKE useEffect RUN ONLY AFTER FIRST RENDER -> THIS IS A DEPENDENCY ARRAY: useEffect(setup, dependencies?)

    async function updateTodoDb(data, serverUrl){        
        console.log("RUNNING updateTodoDb")
        try{
            const response = await fetch(serverUrl, {
                method: "PUT",
                body: JSON.stringify(data), // convert data to a string to send it over HTTP
                headers: { 
                    "Content-Type": "application/json"
                    }
                });
                const result = await response.json(); // Gets only the Response result:  {result: 'ok'}
                console.log("Success:", result);
                console.log("Data sent", JSON.stringify(data)) // Text (needs to be sent as text and then when we Get the data it needs to be converted back to Javascript format using .json() method )
        } catch (error) {
            console.log("Error")
            console.error("Error:", error);
        }                
    }

    // Handling tasks being added to the To-do list
    const handleKeyDownApi = (event, serverUrl) => {
		console.log(event.key);
		if (event.key === "Enter"){
            
            const formatedInputValue = {label: inputValue, done:false} 

            if (todoArray[0].label === "No tasks, add a task"){
            //if (todoArray[0] === "No tasks, add a task"){ // Old version not comp. with API data format
                // Handling the 1st task being added 
                // ->  Updating the current todoArray with the inputValue and then setting it to only consist of the newly added task to exclude the default "No tasks, add a task" value
                
                const updatedTodo = todoArray.push(formatedInputValue).slice(1,todoArray.length+1);
                setTodoArray(updatedTodo);
                //setTodoArray(todoArray.concat(inputValue).slice(1,todoArray.length+1))
                console.log(updatedTodo);
                // PUT - call a function from here that updates the DB via the API
                updateTodoDb(updatedTodo, serverUrl);

            }else{
                const updatedTodo = todoArray.push(formatedInputValue);
                setTodoArray(updatedTodo);
                //setTodoArray(todoArray.concat(inputValue))
                // PUT - call a function from here that updates the DB via the API
                console.log(todoArray)
                updateTodoDb(updatedTodo, serverUrl);
            }
            setInputValue("");
		
		};	
	};

    const removeItem = (index, serverUrl) => {
    }
    
	// const removeItem = (index, serverUrl) => {
	// 	console.log(todoArray, index);
	// 	//todoArray.splice(index, 1) does not work to manipulate the state
	// 	// need to use Filter - to filer out (=return) values 
	// 	const updatedTodo = todoArray.filter((_, i) => i !== index);
	// 	setTodoArray(updatedTodo);
    //     updateTodoDb(updatedTodo, serverUrl);
	// }

    const removeAllItems = (serverUrl) => {
    }
    // const removeAllItems = (serverUrl) => {
    //     console.log("Clicked Remove all todos")
    //     console.log(todoArray)
    //     setTodoArray(["No tasks, add a task"]) // Resets the todoArray to an "empty" Array with only the "No tasks, add a task" item
    //     updateTodoDb(["No tasks, add a task"], serverUrl)
    // }

	return (
		<div>
			<h1 className="text-center">todos</h1>
			<div className="d-flex justify-content-center">
				<ul className="list-group w-50">
					<input className="list-style" type="text" onChange={e => setInputValue(e.target.value)} value={inputValue} onKeyDown={handleKeyDownApi} placeholder="What needs to be done?"/>
                    
					{todoArray.map(  (item, index) => {  
                        console.log(item, index);
                        item.label === "sample task"
                            ? return <li className="list-group-item list-style d-inline-flex justify-content-between" key={index}>{item.label}</li>
                            : return <li className="list-group-item list-style d-inline-flex justify-content-between" key={index}>{item.label}

                                        <button>✅{"done:status"}</button>
                                        <button onClick={() => removeItem(index, serverUrl)}>x</button> 
                            
                                    </li>
                        };
                    );};
					<li className="list-group-item list-style task-counter">{todoArray.length} items left</li>
					<li className="list-group-item list-style" id="button-li"><button id="remove-all-btn" onClick={() => removeAllItems(serverUrl)}>Remove all todos</button></li>
				</ul>
			</div>
		</div>
	)
};

export { App }