import app from './App';

app.listen(process.env.PORT || 5001, () => {
  console.log(`Server is listening on ${process.env.PORT || 5001}`);
});
