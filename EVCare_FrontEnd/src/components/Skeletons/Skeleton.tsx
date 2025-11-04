import styled from "styled-components";

const Skeleton = () => {
  return (
    <StyledWrapper>
      <div className="card">
        <div className="card__skeleton card__title" />
        <div className="card__skeleton card__description"> </div>
      </div>
    </StyledWrapper>
  );
};

interface props {
  count?: number;
}
const SkeletonCount = ({ count }: props) => {
  return (
    <>
      {Array(count)
        .fill(null)
        .map((_, index) => (
          <Skeleton key={index} />
        ))}
    </>
  );
};

const StyledWrapper = styled.div`
  .card {
    width: 100%;
    padding: 1rem;
    text-align: center;
    border-radius: 0.8rem;
    background-color: white;
    margin-bottom: 10px;
  }

  .card__skeleton {
    background-image: linear-gradient(
      90deg,
      #f7f7f7 0px,
      rgb(229 229 229 / 50%) 40px,
      #f7f7f7 80px
    );
    background-size: 300%;
    background-position: 100% 0;
    border-radius: inherit;
    animation: shimmer 1.5s infinite;
  }

  .card__title {
    height: 15px;
    margin-bottom: 15px;
  }

  .card__description {
    height: 100px;
  }

  @keyframes shimmer {
    to {
      background-position: -100% 0;
    }
  }
`;

export default SkeletonCount;
