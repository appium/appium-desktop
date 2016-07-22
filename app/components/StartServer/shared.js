import { PropTypes } from 'react';

export const propTypes = {
  serverArgs: PropTypes.object.isRequired,
  serverStarting: PropTypes.bool.isRequired,
  startServer: PropTypes.func.isRequired,
  updateArgs: PropTypes.func.isRequired,
};

export function updateArg (evt) {
  const {updateArgs} = this.props;
  updateArgs({[evt.target.name]: evt.target.value});
}
