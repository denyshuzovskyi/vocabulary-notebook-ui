'use client'
import {Box, Button, Card, CardContent, Grid, TextField, Typography} from "@mui/material";
import Link from "next/link";
import {useEffect, useState } from "react";

export interface Notebook {
    id: number,
    name: string,
    description: string
}

export default function Home() {
    const [notebooks, setNotebooks] = useState<Notebook[]>([]);

    useEffect(() => {
        fetch('http://localhost:8080/notebooks')
            .then(response => {
                console.log('response: ', response);
                if (!response.ok) {
                    throw new Error(`HTTP error, status = ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('data: ', data);
                setNotebooks(data);
            })
            .catch(error => {
                console.log('error: ', error);
            });
    }, []);

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h4">
                Notebooks
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2}}>
                {notebooks.map(notebook => (
                    <Grid key={notebook.id} item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Link href={`/notebooks/${notebook.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                                    <Typography variant="h6" color="primary">
                                        {notebook.name}
                                    </Typography>
                                </Link>
                                <Typography variant="body2" color="textSecondary">
                                    {notebook.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Box sx={{ mt: 2 }}>
                <Link href="/notebooks/new" passHref>
                    <Button variant="contained" color="primary">
                        Create New Notebook
                    </Button>
                </Link>
            </Box>
        </Box>
    );
}
