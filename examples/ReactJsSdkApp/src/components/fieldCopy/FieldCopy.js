import React, { useState } from "react";
import { Box, IconButton, TextField, Tooltip } from "@mui/material";
import Zoom from "@mui/material/Zoom";
import styled from "styled-components";
import PropTypes from "prop-types";

import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";

const Wrapper = styled(Box)`
  align-items: center;
  column-gap: 10px;
  display: flex;
`;

const FieldCopy = ({ value, label = "", helperText = "", style = {} }) => {
  const [tooltipTitle, setTooltipTitle] = useState("Copy");

  const copyToClipBoard = (text) => {
    navigator.clipboard.writeText(text).then(() => setTooltipTitle("Copied!"));
  };

  return (
    <Wrapper>
      <TextField
        helperText={helperText}
        inputProps={{ readOnly: true }}
        label={label}
        sx={{ width: "100%", "& .MuiInputBase-input": { cursor: "default" } }}
        style={style}
        value={value}
      />
      {value && (
        <Tooltip arrow placement={"top"} title={tooltipTitle} TransitionComponent={Zoom}>
          <IconButton
            onClick={() => copyToClipBoard(value)}
            onMouseLeave={() => setTooltipTitle("Copy")}
            style={helperText ? { marginBottom: "20px" } : {}}
          >
            <ContentCopyOutlinedIcon fontSize={"small"} />
          </IconButton>
        </Tooltip>
      )}
    </Wrapper>
  );
};

FieldCopy.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  helperText: PropTypes.string,
  variant: PropTypes.string,
  style: PropTypes.object,
};

export { FieldCopy };
