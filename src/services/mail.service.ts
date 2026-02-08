import type { SentMessageInfo, Transporter } from "nodemailer";
import juice from "juice";
import { convert } from "html-to-text";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";
import { env } from "../config/env.config";
import { logger } from "../utils/logger.utils";

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html: string;
  from?: string;
}

export class MailService {
  constructor(
    private transporter: Transporter,
    private defaultFrom: string,
  ) {
    this.transporter = transporter;
    this.defaultFrom = defaultFrom;
  }

  private static renderAndInlineTemplate(
    templateName: string,
    data: object,
  ): string {
    const templatePath = path.join(
      __dirname,
      "..",
      "templates",
      `${templateName}.html`,
    );
    try {
      const templateSource = fs.readFileSync(templatePath, "utf8");
      const compiledTemplate = handlebars.compile(templateSource);
      const html = compiledTemplate(data);

      return juice(html);
    } catch (error: any) {
      logger.error(`Error loading email template: ${templateName}`, error);
      return `<p>There was an error generating this email. Please contact support.</p>`;
    }
  }

  private getBaseTemplateData() {
    return {
      appName: env.APP_NAME || "Fixit",
      companyAddress: "Hidden Leaf Village",
      year: new Date().getFullYear(),
      supportEmail: env.SUPPORT_EMAIL,
      supportLink: `mailto:${env.SUPPORT_EMAIL}`,
      // Add other common variables here
    };
  }

  private static loadTemplate(templateName: string, data: object): string {
    const templatePath = path.join(
      __dirname,
      "..",
      "templates",
      `${templateName}.html`,
    );
    const templateSource = fs.readFileSync(templatePath, "utf8");
    const compiledTemplate = handlebars.compile(templateSource);
    return compiledTemplate(data);
  }

  public async sendEmail({
    to,
    subject,
    html,
    from,
  }: EmailOptions): Promise<SentMessageInfo> {
    try {
      const mailOptions = {
        from: from ?? this.defaultFrom,
        to,
        subject,
        text: convert(html, {
          wordwrap: 130,
        }),
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info("Email sent:", info.response);

      return info;
    } catch (error: any) {
      logger.fatal("Error sending email:", error);
      throw error;
    }
  }
}
