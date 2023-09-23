import {React,useState} from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
  
  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));
const Home = () => {

    const classes = useStyles();
    const [privatekey, setPrivatekey] = useState("");
    const navigate = useNavigate();

    const handlePrivatekeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPrivatekey(event.target.value);
    };

    const handleSubmit = () => {

        if(privatekey.trim()!=="") {

            alert("Success");
            const provider = new Web3(Web3.givenProvider || "https://eth-goerli.alchemyapi.io/v2/Vu04GQ4-aSH7QETr8W1iKRQqW8-DShpP");
            const account = provider.eth.accounts.privateKeyToAccount(privatekey);
            provider.eth.defaultAccount = account.address;
            const accountaddress = account.address;
            alert(`Wallet account: ${accountaddress} Wallet Address:${account.address}`);
            navigate('/dashboard',{state:{accountaddress,privatekey}});

        } else {
            alert("Please enter the private key!");
        }

    }

    return(
         <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          AXEN AI
        </Typography>
        <form className={classes.form}>
    
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="privatekey"
            label="Private Key"
            type="text"
            id="privatekey"
            autoComplete="current-password"
            onChange={handlePrivatekeyChange}
          />
       
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
          >
            Connect Wallet
          </Button>
  
        </form>
      </div>
     
    </Container>
    )
}

export default Home;