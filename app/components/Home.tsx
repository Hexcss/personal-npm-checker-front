"use client"
import { useEffect, useState } from 'react';
import {
  Button,
  Container,
  TextField,
  Typography,
  Box,
  List,
  CircularProgress,
  Card,
  CardContent,
  Snackbar,
  Alert
} from '@mui/material';
import axios from 'axios';

export default function Home() {
  const [inputValue, setInputValue] = useState<string>('');
  const [results, setResults] = useState<NpmCheckerResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    const jsonString = `{${inputValue}}`;
    let parsedData;

    try {
      parsedData = JSON.parse(jsonString);
    } catch (error) {
      console.error("Invalid JSON provided:", error);
      setError('Invalid JSON provided.');
      setLoading(false);
      return;
    }

    try {
      const response = (await axios.post('/api/checkDeprecated', parsedData)).data;
      setResults((response) as NpmCheckerResult);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('results:', results);
  }, [results]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center">Check Deprecated NPM Packages</Typography>
      <Box my={4}>
        <TextField
          fullWidth
          multiline
          rows={20}
          variant="outlined"
          label="Dependencies"
          helperText='Paste your "dependencies" or "devDependencies" here...'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading}
        fullWidth
      >
        {loading ? <CircularProgress size={24} /> : 'Check'}
      </Button>
      {results && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>Results:</Typography>
          <List>
            {Object.entries(results.deprecated_packages).map(([pkg, reason]) => (
              <Card key={pkg} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1">{pkg}</Typography>
                  <Typography variant="body2">{reason as string}</Typography>
                </CardContent>
              </Card>
            ))}
          </List>
          <List>
            {Object.entries(results.outdated_packages).map(([pkg, reason]) => (
              <Card key={pkg} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1">{pkg}</Typography>
                  <Typography variant="body2">{reason as string}</Typography>
                </CardContent>
              </Card>
            ))}
          </List>
        </Box>
      )}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}
