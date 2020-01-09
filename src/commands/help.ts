import { out } from "../out";

export default () => {
  out.info("COMMAND             ALIAS  USAGE");
  out.info("reactgen --version   -v    shows the current version");
  out.info("reactgen --list      -l    lists available generators");
  out.info("reactgen --help      -h    shows this help text");
  out.info(
    "reactgen <name>            runs the generator with the specified name"
  );
};
