import PropTypes from "prop-types";

export function PostFilter({ field }) {
  return (
    <div>
      <label htmlFor={`filter-${field}`}>{field}:</label>
      <input type="text" name={`filter-`} id="" />
    </div>
  );
}

PostFilter.propTypes = {
  field: PropTypes.string.isRequired,
};
