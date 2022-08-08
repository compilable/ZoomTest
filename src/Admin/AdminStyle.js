import styled from "styled-components";

export const Form = styled.form`
    display: flex;
    flex-direction: column;

    label {
        margin: 10px 0 5px 0;
    }
`
export const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 10px;
`

export const StyledButton = styled.button`
    background-color: ${ ({ theme }) => theme.colorMain.highlightRed };
    border-radius: 10px;
    padding: 5px 20px;
    color: white;
    border: none;
`

export const DashboardContainer = styled.div`
    background-color: ${ ({ theme }) => theme.colorMain.backgroundLight };
    display: flex;
    flex-direction: column;
    padding: 35px 100px;
    color: ${ ({ theme }) => theme.colorMain.text };
    border-bottom: solid ${ ({ theme }) => theme.colorMain.backgroundDark } 15px;

    h2 {
        color: ${ ({ theme }) => theme.colorMain.highlightMain };
        margin-bottom: 25px;
    }
    h3 {
        font-size: x-large;
        font-weight: 400;
        color: ${ ({ theme }) => theme.colorMain.highlightMain };
        margin-bottom: 25px;
    }
    p {
        font-size: large;
    }
`
