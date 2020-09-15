import React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';



const NewsItems = ({title, link, summary, publisher, key}) => (
    <TableRow key={key}>
      <TableCell>{publisher}</TableCell>
      <TableCell><a href={link}>{title}</a></TableCell>
      <TableCell>{summary.slice(0, 150)}...</TableCell>
    </TableRow>
  )

  const TickerNewsBox = ({newslist, ticker, classes}) => (
    <Card className={classes.cardroot}>
      <Typography className={classes.title} color="textSecondary" gutterBottom>
        News
      </Typography>
      <CardContent>
        <div className="wrapper-article-content">
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                  <TableRow>
                    <TableCell>publisher</TableCell>
                    <TableCell>title</TableCell>
                    <TableCell>Summary</TableCell>
                  </TableRow>
              </TableHead>
              <TableBody>
                {
                  newslist.map((i) => {
                    if(i.ticker === ticker){
                      const newsl = i.news
                      return newsl.map(n => <NewsItems {...n}/>)
                    }
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>
      </div>
      </CardContent>
    </Card>
  )

  export default TickerNewsBox