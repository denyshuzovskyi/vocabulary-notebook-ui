import {Box, Button, Card, CardContent, FormControlLabel, Radio, RadioGroup, Stack, Typography} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ClearIcon from '@mui/icons-material/Clear';
import {TestView} from "@/app/tests/[notebookId]/page";

interface Props {
    quiz: TestView,
    selectedOptionId : number,
    onOptionChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onNextClick: () => void
}
export default function Quiz( params: Props) {
    return (
        <Box>
            <Card>
                <CardContent>
                    <Typography variant="h5">{params?.quiz?.task ?? ""}</Typography>
                    <RadioGroup value={params.selectedOptionId} onChange={params.onOptionChange} sx={{ mt: 1 }}>
                        {params.quiz?.testOptions.map(option=> (
                            <FormControlLabel
                                key={option.id}
                                value={option.id}
                                control={<Radio/>}
                                label={option.option}
                            />
                        ))}
                    </RadioGroup>
                </CardContent>
            </Card>
            <Stack direction="row" spacing={3} sx={{ mt: 3, justifyContent: 'center' }}>
                <Button variant="contained" color="primary">
                    <ArrowBackIcon/>
                </Button>
                <Button variant="contained" color="primary">
                    <ClearIcon/>
                </Button>
                <Button onClick={params.onNextClick} variant="contained" color="primary">
                    <ArrowForwardIcon/>
                </Button>
            </Stack>
        </Box>
    );
}