import React from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import ErrorAnimated from "../../../assets/ErrorAnimated.json";
import InformationScreenTemplate from "./component/InformationScreenTemplate";
import { useI18n } from "@shared/i18n";

type ErrorBoundaryInnerProps = {
  title: string;
  body: string;
  retryLabel: string;
  children: React.ReactNode;
};

class ErrorBoundaryInner extends React.Component<ErrorBoundaryInnerProps> {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Mettez à jour l'état pour afficher l'UI de secours au prochain rendu.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Enregistrez l'erreur dans un service de rapport ou effectuez une autre action.
    console.error(error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <InformationScreenTemplate
          body={this.props.body}
          title={this.props.title}
          lottieWrapperStyle={styles.lottieWrapper}
          lottie={ErrorAnimated}
          lottieRatio={575 / 410}
        >
          <Button
            icon={"backup-restore"}
            onPress={() => window.location.reload()}
            mode="contained"
          >
            {this.props.retryLabel}
          </Button>
        </InformationScreenTemplate>
      );
    }

    return this.props.children;
  }
}
const styles = StyleSheet.create({
  lottieWrapper: {
    transform: [{ scale: 1.35 }],
    bottom: "18%",
    right: "1%",
  },
});

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const { t } = useI18n();
  return (
    <ErrorBoundaryInner
      title={t("error.title")}
      body={t("error.body")}
      retryLabel={t("common.retry")}
    >
      {children}
    </ErrorBoundaryInner>
  );
};

export default ErrorBoundary;
