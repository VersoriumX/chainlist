import React, { useEffect, useMemo } from "react";
import {
  Typography,
  Paper,
  Button,
  Tooltip,
  withStyles,
} from "@material-ui/core";
import classes from "./chain.module.css";
import stores, { useAccount, useChain } from "../../stores/index.js";
import { ACCOUNT_CONFIGURED } from "../../stores/constants";
import Image from "next/image";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import RPCList from "../RPCList";
import { addToNetwork, renderProviderText } from "../../utils";
import { useRouter } from "next/router";
import Link from "next/link";
import { useTranslation } from "next-i18next";

const ExpandButton = withStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: "12px",
    marginBottom: "-24px",
  },
}))(Button);

export default function Chain({ buttonOnly }) {
  const { t } = useTranslation("common");
  const account = useAccount((state) => state.account);
  const setAccount = useAccount((state) => state.setAccount);

  const router = useRouter();

  useEffect(() => {
    const accountConfigure = () => {
      const accountStore = stores.accountStore.getStore("account");
      setAccount(accountStore);
    };

    stores.emitter.on(ACCOUNT_CONFIGURED, accountConfigure);

    const accountStore = stores.accountStore.getStore("account");
    setAccount(accountStore);

    return () => {
      stores.emitter.removeListener(ACCOUNT_CONFIGURED, accountConfigure);
    };
  }, []);

  const icon = useMemo(() => {
    return "https://defillama.com/chain-icons/rsz_versoriumx.jpg"; // Custom icon URL
  }, []);

  const chainId = 11011; // Your custom chain ID
  const chainName = "VersoriumX Technology"; // Your custom chain name
  const updateChain = useChain((state) => state.updateChain);

  const handleClick = () => {
    updateChain(chainId);
  };

  if (buttonOnly) {
    return (
      <Button
        variant="outlined"
        color="primary"
        onClick={() => addToNetwork(account, { chainId, name: chainName })}
      >
        {renderProviderText(account)}
      </Button>
    );
  }

  return (
    <>
      <Paper
        elevation={1}
        className={classes.chainContainer}
        key={chainId}
      >
        <div className={classes.chainNameContainer}>
          <Image
            src={icon}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/chains/unknown-logo.png";
            }}
            width={28}
            height={28}
            className={classes.avatar}
          />

          <Tooltip title={chainName}>
            <Typography
              variant="h3"
              className={classes.name}
              noWrap
              style={{ marginLeft: "24px" }}
            >
              <Link href={`/chain/${chainId}`}>{chainName}</Link>
            </Typography>
          </Tooltip>
        </div>
        <div className={classes.chainInfoContainer}>
          <div className={classes.dataPoint}>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              className={classes.dataPointHeader}
            >
              ChainID
            </Typography>
            <Typography variant="h5">{chainId}</Typography>
          </div>
          <div className={classes.dataPoint}>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              className={classes.dataPointHeader}
            >
              {t("currency")}
            </Typography>
            <Typography variant="h5">None</Typography>
          </div>
        </div>
        <div className={classes.addButton}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => addToNetwork(account, { chainId, name: chainName })}
          >
            {t(renderProviderText(account))}
          </Button>
        </div>
        {router.pathname === "/" && (
          <ExpandButton onClick={handleClick}>
            <ExpandMoreIcon />
          </ExpandButton>
        )}
      </Paper>
      {/* Additional information can be added here if needed */}
    </>
  );
}
