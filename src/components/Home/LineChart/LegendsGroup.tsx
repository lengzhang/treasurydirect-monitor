import { FC } from "react";
import { TermsType } from "./types";
import {
  Box,
  Chip,
  FormControlLabel,
  FormLabel,
  Grid,
  Stack,
  Switch,
} from "@mui/material";

interface LegendsGroupInterface {
  terms: TermsType;
  onTriggerAllLegends: (unit: string, isAllHide: boolean) => () => void;
  onClickLegend: (unit: string, term: string) => () => void;
}

const LegendsGroup: FC<LegendsGroupInterface> = ({
  terms,
  onTriggerAllLegends,
  onClickLegend,
}) => {
  const units = Object.keys(terms).sort((a, b) => a.localeCompare(b));

  return (
    <Stack spacing={1} direction={"column"} marginTop={2}>
      {units.map((unit) => {
        const isAllHide =
          Object.values(terms[unit]).findIndex((term) => !term.hidden) === -1;

        return (
          <Box key={unit}>
            <FormControlLabel
              checked={!isAllHide}
              control={<Switch size="small" />}
              label={<FormLabel>{unit}</FormLabel>}
              labelPlacement="start"
              style={{ marginLeft: 0 }}
              onClick={onTriggerAllLegends(unit, isAllHide)}
            />
            <Grid container spacing={1} direction={"row"} paddingTop={1}>
              {Object.keys(terms[unit])
                .sort((a, b) => parseInt(a) - parseInt(b))
                .map((term) => {
                  const { averagePrice, color, hidden } = terms[unit][term];
                  return (
                    <Grid key={term} item>
                      <Chip
                        style={{ color: hidden ? "gray" : color }}
                        label={term + ": $" + averagePrice.toFixed(2)}
                        size="small"
                        variant="outlined"
                        onClick={onClickLegend(unit, term)}
                      />
                    </Grid>
                  );
                })}
            </Grid>
          </Box>
        );
      })}
    </Stack>
  );
};

export default LegendsGroup;
