import React, { useState } from 'react';
import {useLocation} from 'react-router-dom';
import contractAbi from './erc20abi.json';
import UniswapV3Factory from './UniswapV3Factory.json';
import clsx from 'clsx';
import Web3 from 'web3';

import {TextField,FormControlLabel,Checkbox,makeStyles} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { mainListItems, secondaryListItems } from './listItems';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Chart from './Chart';
import Deposits from './Deposits';
import Orders from './Orders';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function Dashboard() {
 
 /**************Mahesh****************/
 const location = useLocation();
 const address = location.state.accountaddress;
 const privatekey = location.state.privatekey;

 const [amount, setAmount] = useState('');
 const [tokenAddress, setTokenAddress] = useState('');
 const [slippage, setSlippage] = useState('');
 const [sender, setSender] = useState(address); // Replace with your sender address
 const [chain, setChain] = useState('mainnet'); // Replace with your desired chain

 const provider = new Web3(Web3.givenProvider || "https://eth-goerli.alchemyapi.io/v2/Vu04GQ4-aSH7QETr8W1iKRQqW8-DShpP");
 const account = provider.eth.accounts.privateKeyToAccount(privatekey);
 provider.eth.defaultAccount = account.address;
 console.log(account.address);
 const contractAddress="0xED59d7788F4d4e3d611EA3445A5b9678d22A13dd";
 const contract = new provider.eth.Contract(contractAbi, contractAddress);

 const buyTokenV2 = async () => {
    alert("hi");
    try {
        const axenRouter = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
        const wethAddress = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6';

        const myAddress = sender;
        const gasPrice = await provider.eth.getGasPrice();
        const ethAmount = amount;
        const path = [wethAddress, tokenAddress];
      //const amountsOut = await getAmountsOut(parseInt(ethAmount), path, chain);
      //const amountOut = amountsOut[1];
        const slippageFloat = parseFloat(slippage) / 100;
      //const amountOutAfterSlippage = parseInt(amountOut - amountOut * slippageFloat);

      const nonce = await provider.eth.getTransactionCount(myAddress);

      let error = false;
      while (true) {
        try {
          const transaction = contract.methods.swapExactInputSinglebuy(tokenAddress, 0);
          const data = transaction.encodeABI();

          const tx = {
            from: myAddress,
            to: contractAddress,
            value: provider.utils.toWei('0.01', 'ether'),
            data: data,
            nonce: nonce,
            gas: 1000000,
            gasPrice: gasPrice,
          };

          const signedTx = await provider.eth.accounts.signTransaction(tx, '0x10167f3c50b3e823a8edb2d1f1c5b2c06cdf6c7189d045f2363554d0663eb17b');
        
          const txHash = await provider.eth.sendSignedTransaction(signedTx.rawTransaction);
        
          console.log('Transaction Hash:', txHash);
          break;
        } catch (e) {
          if (!error) {
            error = true;
            console.log(e);
          }
          console.log('Sleeping...');
          await sleep(3000);
        }
      }
    }
    catch (error) {
        console.error('Error:', error);
      }
 }

 const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
/*****************Mahesh*************/

/******************Menu******************/
const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
/*******************Menu*****************/


  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            address:{address}
          </Typography>
          <div>
      {/* <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        Open Menu
      </Button> */}

      <IconButton color="inherit" onClick={handleClick}>
            {/* <Badge badgeContent={4} color="secondary"> */}
               <AccountCircle />
            {/* </Badge> */}
          </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </div>

        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <h3>AXEN AI</h3>  
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>{mainListItems}</List>
        <Divider />
        <List>{secondaryListItems}</List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="xl" className={classes.containerfl}>
          {/* Recent Orders */}
             <Grid item xs={12}>
             <Container component="main" maxWidth="md">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="tokenaddress"
            label="Token Address"
            name="tokenaddress"
            autoFocus
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="amount"
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            id="amount"
            autoComplete="amount"
          />
           <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="slippage"
            label="slippage"
            value={slippage}
            onChange={(e) => setSlippage(e.target.value)}
            id="slippage"
            autoComplete="slippage"
          />
           <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="chain"
            label="chain"
            value={chain}
             onChange={(e) => setChain(e.target.value)}
            id="chain"
            autoComplete="chain"
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={buyTokenV2}
          >
            Buy
          </Button>

        </form>
        
      </div>
   
    </Container>
            </Grid>
         
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}