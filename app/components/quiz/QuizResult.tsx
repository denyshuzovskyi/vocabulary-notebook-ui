import {Box, Button, Card, CardContent, Stack, Typography} from "@mui/material";

interface Props {
    numberOfCorrectAnswers: number,
    totalNumberOfQuestions: number,
    onEndQuizClick: () => void
}

export default function QuizResult(params: Props) {
    return (
        <Box>
            <Card>
                <CardContent>
                    <Typography variant="h5" align="center">Quiz Completed!</Typography>
                    <Typography variant="body1" align="center" sx={{ mt: 1 }}>Your Score: {params.numberOfCorrectAnswers}/{params.totalNumberOfQuestions}</Typography>
                </CardContent>
            </Card>
            <Stack direction="row" sx={{ mt: 3, justifyContent: 'center' }}>
                <Button onClick={params.onEndQuizClick} variant="contained" color="primary">
                    End Quiz
                </Button>
            </Stack>
        </Box>
    );
}