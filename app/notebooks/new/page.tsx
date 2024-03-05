'use client'
import {Box, Button, Stack, TextField, Typography} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface NewNotebook {
    name: string;
    description: string;
}

const initialFormValues: NewNotebook = {
    name: '',
    description: '',
};

export default function CreateNotebook() {
    const router = useRouter();
    const [notebookData, setNotebookData] = useState<NewNotebook>(initialFormValues);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setNotebookData((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted:', notebookData);
        submitData();
    };

    function submitData() {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        fetch('http://localhost:8080/notebooks', { method: 'post', headers: myHeaders, body: JSON.stringify(notebookData)} )
            .then(response => {
                console.log('response: ', response);
                if (!response.ok) {
                    throw new Error(`HTTP error, status = ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('data: ', data);
            })
            .catch(error => {
                console.log('error: ', error);
            })
            .finally(() => {
                router.push('/');
            });
    }

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h4" textAlign="center">
                Create new notebook
            </Typography>
            <Stack component="form"
                   spacing={2}
                   onSubmit={handleSubmit}
                   sx={{ width: '300px', mt: 2, mx: 'auto'}}
            >
                <TextField
                    label="Name"
                    name="name"
                    value={notebookData.name}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    label="Description"
                    name="description"
                    value={notebookData.description}
                    onChange={handleChange}
                    margin="normal"
                    multiline
                />
                <Button type="submit" variant="contained" color="primary">
                    Submit
                </Button>
            </Stack>
        </Box>
    );
}