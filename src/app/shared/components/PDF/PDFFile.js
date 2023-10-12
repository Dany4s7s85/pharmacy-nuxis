import React from "react";
import { Page, Text, Image, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "Times-Roman",
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
});

const PDFFile = ({ data: { data }, forType }) => {
  return (
    <Document>
      <Page style={styles.body}>
        <Text style={styles.header} fixed></Text>

        {data?.qr && (
          <>
            <Image style={styles.image} src={data?.qr} />

            <Text style={styles.text}>For : Driver</Text>
            <Text style={styles.text}>Order No # : {data?.order}</Text>
            <Text style={styles.text}>SubOrder No # : {data?.subOrder}</Text>
            <Text style={styles.text}>
              {forType == "recipient" ? "Sender" : "Customer"} : {data?.uuid}
            </Text>
            <Text style={styles.text}>Mobile No : {data?.mobile}</Text>
            <Text style={styles.text}>Address : {data?.address}</Text>

          </>
        )}

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
        />
      </Page>
    </Document>
  );
};

export default PDFFile;
