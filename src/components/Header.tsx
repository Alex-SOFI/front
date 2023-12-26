import { FunctionComponent } from "react";

import styled from "@emotion/styled";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Box from "@mui/material/Box";

/* import { useDisconnect } from 'wagmi'; */
import { Button, Picture, Text } from "../components/basic";
import { PUBLIC_URL } from "../config";
import { muiTheme } from "../styles/globalStyle";
import { Link } from "./basic";

const StyledHeader = styled.header`
    display: flex;
    justify-content: space-between;
    margin-bottom: 5rem;
    padding: ${muiTheme.spacing(1)};
`;

interface HeaderProps {
    handleConnectButtonClick: () => void;
    copyAddress: () => void;
    isLinkOnly: boolean;
    isConnected: boolean;
    address?: string;
    handleSwitchButtonClick: (chainId_?: number | undefined) => void;
    isWrongNetwork: boolean;
}

const Header: FunctionComponent<HeaderProps> = ({
    handleConnectButtonClick,
    copyAddress,
    isLinkOnly,
    isConnected,
    address,
    handleSwitchButtonClick,
    isWrongNetwork,
}) => {
    /* const { disconnect } = useDisconnect(); */

    return (
        <StyledHeader>
            <Link
                href="https://www.sophie.fi/"
                ariaLabel="Visit sophie.fi main page which opens in a new window."
            >
                sophie.fi
            </Link>
            {!isLinkOnly && (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Picture
                        src={`${PUBLIC_URL}/icons/logo_polygon.svg`}
                        alt="Polygon logo"
                        width={40}
                        height={40}
                        marginRight="1rem"
                    />
                    {isConnected ? (
                        isWrongNetwork ? (
                            <Button onClick={() => handleSwitchButtonClick()}>
                                Switch Network
                            </Button>
                        ) : (
                            <Button
                                onClick={copyAddress}
                                variant="text"
                                maxWidth="10.057rem"
                            >
                                <Text
                                    sx={{
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                    }}
                                    variant="h1"
                                >
                                    {address}
                                </Text>
                                <ContentCopyIcon
                                    sx={{
                                        marginRight: "0.5rem",
                                        fontSize: "30px",
                                    }}
                                />
                            </Button>
                        )
                    ) : (
                        <Button
                            onClick={handleConnectButtonClick /* disconnect */}
                        >
                            Connect Wallet
                        </Button>
                    )}
                </Box>
            )}
        </StyledHeader>
    );
};

export default Header;
